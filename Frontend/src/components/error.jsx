import React from "react";

const Error = () => {
    return (
        <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold biru-pln">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight biru-pln sm:text-5xl">Page Not Found</h1>
                <p className="mt-6 text-base leading-7 text-black">Sorry, we couldn’t find the page you’re looking for.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a href="dashboard" className="rounded-md text-white bg-pln px-3.5 py-2.5 text-sm font-semibold shadow-sm">
                        Go back home
                    </a>
                </div>
            </div>
        </main>
    )
}

export default Error;