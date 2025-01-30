import React from "react";

const History = () => {
    return (
        <div className="pt-6">
            <h1 className="font-bold text-[20px] text-gradient px-4">History</h1>
            <div className="p-4 overflow-y-auto bg-gray-50 max-h-screen">
                <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-white">
                    <time className="text-lg font-semibold text-gray-900">13 Januari 2022</time>
                    <ol className="mt-3 divide-y divide-gray-200">
                        <li>
                            <div className="items-center p-3 hover:bg-gray-100">
                                <p className="text-xs font-normal text-gray-500 pb-2 flex justify-start">
                                    14.00 WIB
                                </p>
                                <div>
                                    <p className="text-sm font-normal text-gray-700">
                                        <span className="font-medium text-black">Admin1</span> mengubah{" "}
                                        <span className="font-medium text-black">Tanggal awal</span>.
                                    </p>
                                    <p className="pt-1 text-xs text-gray-500 flex items-center">
                                        1 Januari 2025
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            className="mx-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                        1 Februari 2025
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="items-center p-3 hover:bg-gray-100">
                                <p className="text-xs font-normal text-gray-500 pb-2 flex justify-start">
                                    14.00 WIB
                                </p>
                                <div>
                                    <p className="text-sm font-normal text-gray-700">
                                        <span className="font-medium text-black">Admin2</span> mengubah{" "}
                                        <span className="font-medium text-black">Solusi</span>.
                                    </p>
                                    <p className="pt-1 text-xs text-gray-500 flex items-center flex-wrap">
                                        abcdefghiijklmnopqrstuvwxyz
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            className="mx-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                        1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="items-center p-3 hover:bg-gray-100">
                                <p className="text-xs font-normal text-gray-500 pb-2 flex justify-start">
                                    14.00 WIB
                                </p>
                                <div>
                                    <p className="text-sm font-normal text-gray-700">
                                        <span className="font-medium text-black">Admin2</span> menambahkan{" "}
                                        <span className="font-medium text-black">Solusi</span>.
                                    </p>
                                    <p className="pt-1 text-xs text-gray-500 flex items-center flex-wrap">
                                        abcdefghiijklmnopqrstuvwxyz
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <time className="text-lg font-semibold text-gray-900">12 Januari 2022</time>
                    <ol className="mt-3 divide-y divide-gray-200">
                        <li>
                            <div className="items-center p-3 hover:bg-gray-100">
                                <p className="text-xs font-normal text-gray-500 pb-2 flex justify-start">
                                    14.00 WIB
                                </p>
                                <div>
                                    <p className="text-sm font-normal text-gray-700">
                                        <span className="font-medium text-black">Admin2</span> membuat pekerjaan ini.
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default History;
