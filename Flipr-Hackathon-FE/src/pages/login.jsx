import LoginForm from "../components/auth/Loginform";

export default function Login() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Login Form*/}
        <LoginForm />
      </div>
    </div>
  );
}
