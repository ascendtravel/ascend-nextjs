import { FC } from "react";

const GettedCreditCard: FC<{ credits: number }> = ({ credits }) => {
    const _handleInviteAFriend = () => {
        //TODO
    }
    return <div className="w-[100%] overflow-hidden card rounded-[20px] bg-white flex justify-center items-center flex-col" style={{ maxWidth: 600 }}>
        <img src="/images/notice-checkbox.png" alt="" className="w-full h-[100px] md:hidden" />
        {/* //change image */}
        <div className="p-[1.7em] md:p-[2.5em] px-[2em] md:px-[3em] ">
            <h1 className="font-bold leading-[1em] mb-[0.5em] text-[1.2rem] md:text-[1.4rem] text-center">You'll get <span className="text-[green]">$320</span> airline credit!</h1>
            <p className="mb-6 text-center text-[1rem] md:text-left">We're on it. Here’s what to expect next:</p>
            <div className="mb-8">
                <div className="flex items-center my-3 font-semibold md:text-[1rem] text-[0.9rem]">
                    <img src="/images/e-mail-icon.png" className="me-3" /> <span className="text-semibold">We'll secure your new price</span>
                </div>
                <div className="flex items-center my-3 font-semibold md:text-[1rem] text-[0.9rem]">
                    <img src="/images/airplane-icon.png" className="me-3" /> <span className="text-semibold">You'll get a confirmation email</span>
                </div>
                <div className="flex items-center my-3 font-semibold md:text-[1rem] text-[0.9rem]">
                    <img src="/images/money-icon.png" className="me-3" /> <span className="text-semibold">Use your airline credits</span>
                </div>

            </div>
            <div className="inline-flex w-full m-x-10 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-6 py-6 has-[>svg]:px-3 px-[70px] rounded-full bg-[#1DC167] hidden md:flex">Invite a friend</div>
            <span className="text-center mt-4 text-gray-400 block md:hidden">Need help? <a href="mailto:help@axel.com" className="underline cursor-pointer">help@axel.com</a></span>
        </div>
    </div>
}

export default GettedCreditCard;