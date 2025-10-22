"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import axios from "@/lib/axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/features/user/userSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = useCallback(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
    } else if (formData.password && formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError(null);
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validatePassword();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.password, formData.confirmPassword, validatePassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Check if there are any password validation errors
    if (passwordError) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending signup request...");
      const response = await axios.post("api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Signup response:", response);
      const { data } = response;

      // Validate JWT token and user data
      if (!data.token || !data.username || !data.email) {
        setError("Account created but authentication data is incomplete");
        return;
      }

      // Update Redux state and redirect
      try {
        localStorage.setItem("token", data.token);
        dispatch(
          setUser({
            user: {
              name: data.name,
              email: data.email,
            },
            token: data.token,
          })
        );
        router.push("/movies");
      } catch {
        setError("Failed to save authentication data. Please try logging in.");
      }
    } catch (err) {
      console.log(err);
      if (isAxiosError(err)) {
        // Handle specific API error cases
        if (err.response?.status === 409) {
          setError("This email is already registered. Please try logging in.");
        } else if (err.response?.status === 400) {
          setError(
            err.response.data.message ||
              "Please check your input and try again."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to create account. Please try again."
          );
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Username"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="username@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={
                  passwordError && formData.password ? "border-destructive" : ""
                }
              />
              <FieldDescription
                className={
                  passwordError && formData.password ? "text-destructive" : ""
                }
              >
                Must be at least 6 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError ? (
                <FieldDescription className="text-destructive">
                  {passwordError}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              )}
            </Field>
            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
