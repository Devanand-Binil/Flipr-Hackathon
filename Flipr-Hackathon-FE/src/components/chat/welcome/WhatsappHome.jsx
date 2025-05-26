import { Logo } from '../../../svg';

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

        </div>
    );
}

export default WhatsappHome;