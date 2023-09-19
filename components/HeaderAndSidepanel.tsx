'use client';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidepanel } from './Sidepanel';

export function HeaderAndSidepanel(props: { children: React.ReactNode }) {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isOpen, setIsOpen] = useState(false);

    //====================================================================
    // ==== 処理 ====
    // ハンバーガーメニューの開閉
    const handleMenuOpen = () => {
        setIsOpen(!isOpen);
    };

    // 画面幅に応じてハンバーガーメニューの表示を切り替える、1000px以上の場合は常に表示
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return;
    }, []);

    return (
        <>
            <Header isOpen={isOpen} humbergurBtnFunc={handleMenuOpen} />
            <div className="flex">
                <Sidepanel isOpen={isOpen} />
                <div className={isOpen ? 'w-full ml-0 duration-300 md:ml-[220px]' : 'w-full ml-0 duration-300'}>
                    {props.children}
                </div>
            </div>
        </>
    );
}