import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { LoginRequest } from '@/types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
      />

      <motion.div
        style={{
          position: 'relative',
          backgroundColor: colors.surface,
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '448px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: colors.text }}>Login</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: colors.text }}>
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: colors.text }}>
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.border,
                    color: colors.text,
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: colors.primary,
                    color: 'white',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.875rem', color: colors.text }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Register
              </button>
            </p>
          </motion.div>
        </div>,
    document.body
  );
}
