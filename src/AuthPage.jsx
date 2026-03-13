import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
      // Redirect to dashboard or handle success
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date()
      });
      navigate('/');
      // Redirect or handle success
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setError('Reset link sent to your email');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date()
        },
        { merge: true }
      );
      navigate('/');
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:grid md:grid-cols-2">
      <div className="order-2 md:order-1 flex items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === 'login' ? 'Sign in to monitor your respiratory health insights.' : mode === 'signup' ? 'Join RespiraGuard to start monitoring.' : 'Enter your email to reset your password.'}
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handlePasswordReset}>
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="mr-2">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="mr-2">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="mr-2">🔒</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                      <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="mr-2">🔒</span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Remember me
                </label>
                <button type="button" onClick={() => setMode('forgot')} className="text-blue-500 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-4"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {mode === 'login' && (
            <>
              <button onClick={handleGoogleSignIn} className="w-full border border-gray-300 py-2 rounded-lg mb-4">
                Sign in with Google
              </button>
              <p className="text-center">
                Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-500 hover:underline">Sign Up</button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-center">
              Already have an account? <button onClick={() => setMode('login')} className="text-blue-500 hover:underline">Sign In</button>
            </p>
          )}

          {mode === 'forgot' && (
            <p className="text-center">
              <button onClick={() => setMode('login')} className="text-blue-500 hover:underline">Back to Sign In</button>
            </p>
          )}
        </div>
      </div>

      <div className="order-1 md:order-2 relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/src/assets/lung-animation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent"></div>
      </div>
    </section>
  );
};

export default AuthPage;