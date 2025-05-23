import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    
    setError('');
    
    const success = await forgotPassword(email);
    if (success) {
      setSubmitted(true);
    } else {
      setError('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Forgot Password</h1>
        <p className="text-neutral-600">
          {!submitted
            ? "Enter your email and we'll send you a link to reset your password"
            : "We've sent you an email with instructions to reset your password"}
        </p>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            className="mt-6"
          >
            Send Reset Link
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-primary-500 hover:text-primary-600 text-sm">
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <p className="text-neutral-600 mb-6">
            Please check your email for instructions to reset your password.
            If you don't see it, please check your spam folder.
          </p>
          
          <Button
            variant="primary"
            fullWidth
            onClick={() => setSubmitted(false)}
          >
            Try Again
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-primary-500 hover:text-primary-600 text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;