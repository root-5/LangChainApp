'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Headline2 } from '../../../components/Headline2';
import { Strong } from '../../../components/Strong';
import { modeData, docData } from '../../../components/data/codingData';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isZen, setIsZen] = useState(false); // Zenモードを管理
    const [language, setLanguage] = useState('JavaScript'); // モードを管理
    const [mode, setMode] = useState({
        name: modeData[0].name,
        text: modeData[0].text,
        placeholder: modeData[0].placeholder,
    }); // モードを管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [fixOrder, setFixOrder] = useState(
        'このコードではエラーが出ているので、エラーが発生しないように修正してください'
    ); // 修正指示を管理
    const [result, setResult] = useState(''); //出力の内容を管理
    const [searchInput, setSearchInput] = useState(''); // 検索ボックスの入力を管理
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('../api/coding/getAnswer', {
                method: 'POST',
                body: JSON.stringify({
                    language: formData.get('language'),
                    mode: formData.get('mode'),
                    text: formData.get('inputText'),
                    fixOrder: formData.get('fixOrder'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            setResult(text);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    // 検索ボックスの入力があった時の処理
    const seachInputFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);

        let searchHitCount = 0;
        let searchHitDataNum = 0;

        // ドキュメント一覧から検索ヒットしたものを探す
        for (let i = 0; i < docData.length; i++) {
            const lowerDocData = docData[i].name.toLowerCase();
            const lowerSearchInput = e.target.value.toLowerCase();
            if (!lowerDocData.indexOf(lowerSearchInput)) {
                searchHitCount++;
                searchHitDataNum = i;
            }
        }

        if (searchHitCount === 1) {
            window.open(docData[searchHitDataNum].link, '_blank');
            setSearchInput('');
        }
    };

    //====================================================================
    // ==== マウント時の処理 ====
    useEffect(() => {
        const inputText = document.getElementById('inputText') as HTMLTextAreaElement;
        const inputDocsName = document.getElementById('inputDocsName') as HTMLInputElement;

        // textareaやinputにフォーカスがついていない時、"/"入力で検索ボックスにフォーカスを当てる
        document.addEventListener('keydown', (e) => {
            if (e.key === '/') {
                if (inputText !== document.activeElement && inputDocsName !== document.activeElement) {
                    e.preventDefault();
                    setSearchInput('');
                    inputDocsName.focus();
                }
            }
        });
    }, []);

    //====================================================================
    // ==== Zenモードの処理 ====
    // #zenBtnのdata-isZenStatus属性が変更されたら、isZenのステートを更新
    useEffect(() => {
        const zenBtnEle = document.getElementById('zenBtn');
        if (!zenBtnEle) return;
        const observer = new MutationObserver(() => {
            const isZenStatus = zenBtnEle.getAttribute('data-zen-status');
            if (isZenStatus === 'true') {
                setIsZen(true);
            } else {
                setIsZen(false);
            }
        });
        observer.observe(zenBtnEle, {
            attributes: true,
            attributeFilter: ['data-zen-status'],
        });
    }, []);

    //====================================================================
    // ==== パーツを生成 ====
    // モードの選択パーツを生成
    const modeItems = modeData.map((item, i) => (
        <li key={i} className="w-36 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-500">
            <div className="flex items-center pl-3">
                <input
                    type="radio"
                    id={item.name}
                    name="mode"
                    onChange={(e) => {
                        setMode({ name: item.name, text: item.text, placeholder: item.placeholder });
                    }}
                    value={item.name}
                    className="w-4 h-4 text-blue-600 dark:ring-offset-gray-700 hover:cursor-pointer"
                />
                <label htmlFor={item.name} className="w-full py-2 ml-2 text-sm hover:cursor-pointer">
                    {item.text}
                </label>
            </div>
        </li>
    ));

    // 言語の選択パーツを生成
    const langItems = docData
        .filter((doc) => {
            return doc.isLang === true;
        })
        .map((doc, i) => (
            <option key={i} value={doc.name}>
                {doc.name}
            </option>
        ));

    // ドキュメントの例を表示するパーツを生成
    const examples = docData.map((doc, i) => <span key={i}>{doc.name}&nbsp;/&nbsp;</span>);

    //====================================================================
    // ==== レンダリング ====
    return (
        <main>
            <Headline2 className={isZen ? '!text-2xl' : ''}>コーディング補助</Headline2>
            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <Strong hidden={isZen}>入力</Strong>
                <div className="flex flex-col">
                    <div className={isZen ? 'flex mt-0 gap-5 items-center' : 'flex mt-4 gap-5 items-center'}>
                        <label htmlFor="language" hidden={isZen} className="font-bold">
                            言語
                        </label>
                        <select
                            name="language"
                            id="language"
                            onChange={(e) => setLanguage(e.target.value)}
                            className={
                                isZen
                                    ? 'p-1 w-28 border border-gray-300 rounded-md dark:text-gray-900'
                                    : 'p-2 w-40 border border-gray-300 rounded-md dark:text-gray-900'
                            }
                        >
                            {langItems}
                        </select>
                    </div>
                    <div className="flex mt-4 gap-5 items-center">
                        <p hidden={isZen} className="font-bold">
                            モード
                        </p>
                        <ul className="flex flex-1 flex-wrap items-center w-fit text-sm font-medium gap-[1px] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                            {modeItems}
                        </ul>
                    </div>
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={mode.placeholder}
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        className="mt-4 p-2 h-40 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div className="flex mt-4 gap-5 items-center">
                        <label hidden={mode.name !== 'fix'} htmlFor="fixOrder" className="font-bold">
                            どう修正したいか
                        </label>
                        <input
                            type="text"
                            hidden={mode.name !== 'fix'}
                            id="fixOrder"
                            name="fixOrder"
                            placeholder={'全てのconsole.logをalertに変更してください'}
                            value={fixOrder}
                            onChange={(e) => setFixOrder(e.target.value)}
                            className="flex-1 p-2 w-full border border-gray-300 rounded-md dark:text-gray-900"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading === true}
                    className="relative mt-2 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    {mode.text}
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>
            {/* 出力の表示 */}
            <div className={isZen ? 'mt-6' : 'mt-10'}>
                <Strong hidden={isZen}>出力</Strong>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="relative mt-2">
                    <SyntaxHighlighter
                        language={language.toLowerCase()}
                        className="mt-2 w-full border border-gray-300 rounded-md resize-y h-60"
                    >
                        {result}
                    </SyntaxHighlighter>
                    <p
                        className="absolute z-2 bottom-2.5 right-2 flex items-center justify-center w-10 h-4 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200"
                        onClick={(e) => {
                            navigator.clipboard.writeText(result);
                            e.currentTarget.innerText = 'Copied!';
                        }}
                    >
                        Copy
                    </p>
                </div>
            </div>
            <Headline2 className={isZen ? '!text-2xl mt-6' : 'mt-12'}>ドキュメント等検索</Headline2>
            <input
                type="text"
                name="inputDocsName"
                id="inputDocsName"
                value={searchInput}
                onChange={seachInputFunc}
                placeholder={isZen ? 'ショートカット "/"' : '正式名称を半角英字で入力（小文字可）'}
                required
                className={'block m-0 p-2 border border-gray-300 rounded-md dark:text-gray-900 w-2/3'}
            />
            <p hidden={isZen} className="flex flex-wrap mt-2 text-xs">
                {examples}
            </p>
        </main>
    );
}
