import { createContext, useContext, useState } from 'react';
import { trpc } from '../lib/trpc';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const utils = trpc.useUtils();
  const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  const eventsQuery = trpc.events.list.useQuery({ page: 1, limit: 100 });
  const userEventsQuery = trpc.registrations.getUserEvents.useQuery(undefined, {
    enabled: !!currentUser,
  });

  // tRPC Queries & Mutations
  const authMeQuery = trpc.auth.me.useQuery(undefined, {
    enabled: !!localStorage.getItem('authToken'),
    retry: false,
    onSuccess: (data) => setCurrentUser(data),
    onError: () => {
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    }
  });

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const createEventMutation = trpc.events.create.useMutation();
  const updateEventMutation = trpc.events.update.useMutation();
  const deleteEventMutation = trpc.events.delete.useMutation();
  const registerForEventMutation = trpc.registrations.register.useMutation();
  const cancelRegistrationMutation = trpc.registrations.cancel.useMutation();
  const sendMessageMutation = trpc.chats.sendMessage.useMutation();
  const addMemoryMutation = trpc.memories.create.useMutation();
  const likeMemoryMutation = trpc.memories.like.useMutation();
  const addCommentMutation = trpc.memories.addComment.useMutation();

  const events = eventsQuery.data?.events || [];
  const memories = [];
  const chats = {};
  const registrations = [];

  const getUserEvents = () => userEventsQuery.data || [];

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback || 'Unknown error';
    if (typeof error.message === 'string' && error.message.trim()) return error.message;
    if (typeof error.shape?.message === 'string' && error.shape.message.trim()) return error.shape.message;
    if (typeof error?.data?.message === 'string' && error.data.message.trim()) return error.data.message;
    return fallback || 'An error occurred';
  };

  const isTransientNetworkError = (message) => {
    if (!message) return false;
    return (
      message.includes('Unable to transform response from server') ||
      message.includes('Failed to fetch')
    );
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const rawAuthCall = async (procedure, input) => {
    const endpoint = `${apiBaseUrl}/api/trpc/${procedure}?batch=1`;
    const token = localStorage.getItem('authToken');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        0: {
          json: input,
        },
      }),
    });

    const payload = await response.json();
    const result = Array.isArray(payload) ? payload[0] : null;

    if (!result) {
      throw new Error('Invalid server response: expected array');
    }

    if (result.error) {
      throw new Error(result.error?.json?.message || 'Request failed');
    }

    if (!result?.result?.data?.json) {
      throw new Error('Invalid response structure from server');
    }

    return result.result.data.json;
  };

  // Auth
  const login = async (email, password) => {
    try {
      let result;
      try {
        result = await loginMutation.mutateAsync({ email, password });
      } catch (firstError) {
        const firstMessage = getErrorMessage(firstError, 'Login failed');
        if (!isTransientNetworkError(firstMessage)) {
          throw firstError;
        }

        // Fallback to raw endpoint call when tRPC transform/network glitches occur.
        await wait(1200);
        result = await rawAuthCall('auth.login', { email, password });
      }

      localStorage.setItem('authToken', result.token);
      setCurrentUser(result.user);
      await utils.auth.me.invalidate();
      showNotification('Welcome back, ' + result.user.name + '!', 'success');
      return { success: true, user: result.user };
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      showNotification(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (data) => {
    try {
      let result;
      try {
        result = await registerMutation.mutateAsync(data);
      } catch (firstError) {
        const firstMessage = getErrorMessage(firstError, 'Registration failed');
        if (!isTransientNetworkError(firstMessage)) {
          throw firstError;
        }

        // Fallback to raw endpoint call when tRPC transform/network glitches occur.
        await wait(1200);
        result = await rawAuthCall('auth.register', data);
      }

      localStorage.setItem('authToken', result.token);
      setCurrentUser(result.user);
      await utils.auth.me.invalidate();
      showNotification('Account created! Welcome to V\'eventa 🎉', 'success');
      return { success: true, user: result.user };
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
      showNotification(message, 'error');
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    showNotification('Logged out successfully.', 'info');
  };

  // Events
  const createEvent = async (eventData) => {
    try {
      const newEvent = await createEventMutation.mutateAsync(eventData);
      await utils.events.list.invalidate();
      showNotification('Event created successfully!', 'success');
      return newEvent;
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to create event'), 'error');
      throw error;
    }
  };

  const updateEvent = async (id, updates) => {
    try {
      await updateEventMutation.mutateAsync({ eventId: id, ...updates });
      await utils.events.list.invalidate();
      await utils.events.getById.invalidate(id);
      showNotification('Event updated.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to update event'), 'error');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await deleteEventMutation.mutateAsync(id);
      await utils.events.list.invalidate();
      showNotification('Event deleted.', 'info');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to delete event'), 'error');
    }
  };

  // Registrations
  const registerForEvent = async (eventId) => {
    if (!currentUser) return { success: false, message: 'Please log in first.' };
    try {
      await registerForEventMutation.mutateAsync(eventId);
      await utils.events.getById.invalidate(eventId);
      await utils.registrations.getUserEvents.invalidate();
      showNotification('You\'re registered! 🎉', 'success');
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
      showNotification(message, 'error');
      return { success: false, message };
    }
  };

  const cancelRegistration = async (eventId) => {
    try {
      await cancelRegistrationMutation.mutateAsync(eventId);
      await utils.events.getById.invalidate(eventId);
      await utils.registrations.getUserEvents.invalidate();
      showNotification('Registration cancelled.', 'info');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to cancel registration'), 'error');
    }
  };

  // Chat
  const sendMessage = async (eventId, text) => {
    if (!text.trim() || !currentUser) return;
    try {
      await sendMessageMutation.mutateAsync({ eventId, text });
    } catch (error) {
      showNotification('Failed to send message', 'error');
    }
  };

  // Memories
  const addMemory = async (memory) => {
    try {
      await addMemoryMutation.mutateAsync(memory);
      showNotification('Memory shared!', 'success');
    } catch (error) {
      showNotification('Failed to share memory', 'error');
    }
  };

  const likeMemory = async (memoryId) => {
    try {
      await likeMemoryMutation.mutateAsync(memoryId);
    } catch (error) {
      showNotification('Failed to like memory', 'error');
    }
  };

  const addComment = async (memoryId, text) => {
    if (!text.trim() || !currentUser) return;
    try {
      await addCommentMutation.mutateAsync({ memoryId, text });
    } catch (error) {
      showNotification('Failed to add comment', 'error');
    }
  };

  // Notifications
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, register, logout,
      isAuthLoading: authMeQuery.isLoading,
      events, memories, chats, registrations, getUserEvents,
      createEvent, updateEvent, deleteEvent,
      registerForEvent, cancelRegistration,
      addMemory, likeMemory, addComment,
      sendMessage,
      notification, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
