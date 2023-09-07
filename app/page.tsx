'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

export default function Page() {
    // ステートの宣言
    const [formTextLength, setFormTextLength] = useState(0); // フォームの文字数を管理
    const [result, setResult] = useState({ resultText: '', resultLength: 0 }); //レスポンスの文字数と内容を管理
    const [isError, setIsError] = useState({ errorStatus: false, errorMessage: '' }); // エラー状態の有無とエラーメッセージを管理
    const [status, setStatus] = useState('typing'); // 表示状態を管理、'typing'は入力中、'loading'はロード中

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('loading');

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('/api/summary', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
                    length: formData.get('textLength'),
                    // kansai: formData.get('kansaiToggle'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseJson = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseJson.result;
            const length = text.length;
            setResult({ resultText: text, resultLength: length });
        } catch (error) {
            const errorMessage = (error as Error).toString();
            setIsError({ errorStatus: true, errorMessage: errorMessage });
        }
        setStatus('typing');
    }

    // 入力トリガーでテキストエリア（入力部分）の文字数を表示する
    function showFormTextLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setFormTextLength(length);
    }

    // 結果のテキストをコピーする
    function copyText(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const text = result.resultText;
        navigator.clipboard.writeText(text);
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>文章要約</Headline2>

            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <p className="text-2xl">入力</p>
                <div className="flex flex-col">
                    <textarea
                        name="inputText"
                        id="inputText"
                        placeholder="ここに要約したい文章を入力してください"
                        className="mt-2 p-2 h-64 border border-gray-300 rounded-md"
                        onChangeCapture={showFormTextLength}
                    />
                    <p className="text-gray-700 text-right">{formTextLength}文字</p>
                    <div className="flex gap-5 items-center">
                        <label className="">要約後の文字数</label>
                        <select
                            name="textLength"
                            id="textLength"
                            className="p-2 w-20 border border-gray-300 rounded-md"
                        >
                            <option>100</option>
                            <option>200</option>
                            <option>300</option>
                            <option>400</option>
                            <option>500</option>
                        </select>
                    </div>
                    {/* <label className="relative mt-4 w-fit flex gap-5 items-center cursor-pointer">
                        <span className="">関西弁で要約する</span>
                        <input
                            type="checkbox"
                            value="関西弁に翻訳した上で"
                            name="kansaiToggle"
                            id="kansaiToggle"
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label> */}
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="relative mt-4 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-gray-300"
                >
                    要約する
                    <div
                        hidden={status === 'typing'}
                        className="absolute top-1 left-24 animate-spin h-8 w-8 bg-blue-200 duration-300 rounded-xl pointer-events-none"
                    ></div>
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>

            {/* 出力の表示 */}
            <div className="mt-10">
                <p className="text-2xl">出力</p>
                <p hidden={isError.errorStatus} className="mt-2 text-gray-700">
                    {isError.errorStatus ? isError.errorMessage : ''}
                </p>
                <div className="relative mt-2">
                    <textarea
                        className="p-2 h-64 w-full border border-gray-300 rounded-md"
                        placeholder="ここに要約結果が表示されます"
                        value={result.resultText}
                        readOnly
                    ></textarea>
                    <Image
                        src="/img/copy.png"
                        width={24}
                        height={24}
                        alt={'コピー'}
                        className="absolute bottom-2 right-1 p-2 w-10 h-10 opacity-30 duration-300 rounded-2xl hover:opacity-100 cursor-pointer active:bg-blue-200"
                        onClick={copyText}
                    />
                </div>
                <p className="text-gray-700 text-right">{result.resultLength}文字</p>
            </div>
        </main>
    );
}
