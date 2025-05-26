import { Logo } from '../../../svg';
import { Link } from 'react-router-dom';

const WhatsappHome = () => {
    return (
        <div className='h-full w-full dark:bg-dark_bg_4 select-none border-l dark:border-l-darkborder_2
        border-b-[6px] border-b-green_2'>

            <div className='mt-1.5 w-full h-full flex flex-row gap-y-8 items-center justify-evenly'>
                <span >
                    <Logo/>
                </span>
                <div class="w-px h-[300px] bg-white"></div>
                <div className='mt-1 text-center space-y-[12px]'>
                    <h1 className="text-[32px] dark:text-dark_text_4 font-extralight">
                        ChitChat
                    </h1>
                    <p className='text-lg dark:text-dark_text_3'>
                        Send and receive messages without keeping your phone online.<br/>
                    </p>
                </div>
            </div>


const SockItHome = () => {
  return (
    <div className="h-full w-full dark:bg-dark_bg_4 select-none border-l dark:border-l-darkborder_2 border-b-[6px] border-b-blue-600">
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-8">
        <span>
          <Logo className="w-24 h-24" />
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">Welcome to Sock-It 💬</h1>
          <p className="text-md text-gray-400 max-w-md">
            Sock-It is a fast, secure, and modern chat experience built for simplicity and privacy.
            Connect with friends, collaborate with teams, and keep your conversations flowing—all in real time.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SockItHome;
