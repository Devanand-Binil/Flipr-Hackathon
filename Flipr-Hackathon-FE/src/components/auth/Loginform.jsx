import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import  { loginUser } from "../../features/userSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signInSchema) });
  const onSubmit = async (data) => {
    let res = await dispatch(loginUser({ ...data }));
    if (res?.payload?.user){ 
      localStorage.setItem("user", JSON.stringify(res.payload.user)); // <-- ADD THIS
      navigate("/");}
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        <div className="text-center text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm">Sign In</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="email"
            type="text"
            placeholder="Email Address"
            register={register}
            error={errors?.email?.message}
          />

          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />

          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}

          <button
            className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold
                    focus:outline-none hover:bg-blue-700 shadow-lg cursor-pointer transition ease-in duration-300"
            type="submit"
          >
            {status == "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign In"
            )}
          </button>
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1 ">
            <span> Not have an account? </span>
            <Link
              to="/register"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
