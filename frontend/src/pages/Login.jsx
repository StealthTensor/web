import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signup, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      if (isLoginMode) {
        await login(emailRef.current.value, passwordRef.current.value);
      } else {
        await signup(emailRef.current.value, passwordRef.current.value);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(`Failed to ${isLoginMode ? 'log in' : 'sign up'}. Please check your credentials.`);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      setError('Failed to log in with Google.');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#18181b', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>
            {isLoginMode ? 'Welcome back' : 'Create an account'}
          </h2>
        </div>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <button disabled={loading} onClick={handleGoogleLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem', backgroundColor: 'transparent', color: 'white', border: '1px solid #3f3f46', borderRadius: '9999px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'background-color 0.2s' }}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ width: '20px', height: '20px' }} />
            Continue with Google
          </button>
          
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#3f3f46' }}></div>
          <span style={{ padding: '0 1rem', color: '#a1a1aa', fontSize: '0.875rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#3f3f46' }}></div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Enter email address"
            required 
            ref={emailRef} 
            style={{ width: '100%', padding: '1rem', backgroundColor: '#27272a', border: '1px solid transparent', borderRadius: '12px', color: 'white', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} 
          />
          <input 
            type="password" 
            placeholder="Enter password"
            required 
            ref={passwordRef} 
            style={{ width: '100%', padding: '1rem', backgroundColor: '#27272a', border: '1px solid transparent', borderRadius: '12px', color: 'white', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} 
          />
          <button 
            disabled={loading} 
            type="submit" 
            style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'opacity 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: loading ? 0.7 : 1 }}
          >
             {loading ? (
               <Loader
                 className="w-6 h-6 text-zinc-400"
                 style={{
                   animation: "spin 1s linear infinite",
                 }}
               />
             ) : (
               isLoginMode ? 'Continue' : 'Sign Up'
             )}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#a1a1aa', lineHeight: '1.5' }}>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} 
            style={{ background: 'none', border: 'none', color: '#bcbcbe', fontWeight: 'bold', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
            {isLoginMode ? "Sign up" : "Log in"}
          </button>
        </p>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#a1a1aa', lineHeight: '1.5' }}>
          By continuing, you agree to our <a href="/terms" style={{ color: '#a1a1aa', textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#a1a1aa', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}
