'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';
import { pagesData } from '../components/data/pagesData';

//====================================================================
// ==== データ ====
// ドキュメント一覧
const docArr = [
    {
        key: 1,
        link: 'https://tailwindcss.com/docs/installation',
        name: 'tailwindcss',
    },
    {
        key: 2,
        link: 'https://ja.react.dev/learn',
        name: 'React',
    },
    {
        key: 3,
        link: 'https://nextjs.org/docs',
        name: 'Next.js',
    },
    {
        key: 4,
        link: 'https://js.langchain.com/docs/get_started/introduction/',
        name: 'LangChain',
    },
    {
        key: 5,
        link: 'https://www.typescriptlang.org/docs/',
        name: 'TypeScript',
    },
];

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [memo, setMemo] = useState(''); //レスポンスの文字数と内容を管理

    //====================================================================
    // ==== データベースAPI ====
    // データベースからmemoテーブルのデータを取得する
    async function getMemoData() {
        const response = await fetch('/api/memo');
        const data = await response.json();
        const description = data[0].description;
        setMemo(description);
        return;
    }
    // データベースにテキストエリアのデータを保存する
    async function setMemoData() {
        const response = await fetch('/api/memo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1, description: memo }),
        });
        const data = await response.json();
        return;
    }
    useEffect(() => {
        getMemoData();
    }, []);

    //====================================================================
    // ==== ドキュメント一覧パーツを生成 ====
    const docItems = docArr.map((doc) => (
        <li key={doc.key} className="block border rounded-lg">
            <Link href={doc.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{doc.name}</h3>
            </Link>
        </li>
    ));

    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page) => (
        <li key={page.key} className="block border rounded-lg">
            <Link href={'./' + page.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{page.name}</h3>
                <p className="mt-4 text-lg">{page.description}</p>
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>ドキュメント一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{docItems}</ul>
            <Headline2>機能一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{linkItems}</ul>
            <Headline2>ホワイトボード</Headline2>
            <div className="relative border-b-8 border-slate-600">
                <div className="absolute bottom-0 right-32 w-12 h-4 bg-sky-600"></div>
                <div className="absolute bottom-2 right-8 w-6 h-6 bg-yellow-300 rounded-full"></div>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    onBlur={setMemoData}
                    className={
                        memo === ''
                            ? 'block mt-2 w-full border p-4 h-96 focus:outline-none dark:text-gray-900 bg-gray-100 animate-pulse'
                            : 'block mt-2 w-full border p-4 h-96 focus:outline-none dark:text-gray-900'
                    }
                ></textarea>
            </div>
        </main>
    );
}
