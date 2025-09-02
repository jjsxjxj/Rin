import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { ClientConfigContext } from '../state/config';
import { Helmet } from "react-helmet";
import { siteName } from '../utils/constants';
import { useTranslation } from "react-i18next";
import { useLoginModal } from '../hooks/useLoginModal';

type ThemeMode = 'light' | 'dark' | 'system';
function Footer() {
    const { t } = useTranslation()
    const [modeState, setModeState] = useState<ThemeMode>('system');
    const config = useContext(ClientConfigContext);
    const footerHtml = config.get<string>('footer');
    const loginEnabled = config.get<boolean>('login.enabled');
    const [doubleClickTimes, setDoubleClickTimes] = useState(0);
    const { LoginModal, setIsOpened } = useLoginModal()
    
    useEffect(() => {
        const mode = localStorage.getItem('theme') as ThemeMode || 'system';
        setModeState(mode);
        setMode(mode);
    }, []); // 补充分号（可选，但避免语法歧义）

    const setMode = (mode: ThemeMode) => {
        setModeState(mode);
        localStorage.setItem('theme', mode);

        // 修复条件判断中的括号和模板字符串闭合
        if (mode !== 'system' || (!('theme' in localStorage) && window.matchMedia(`(prefers-color-scheme: ${mode})`).matches)) {
            document.documentElement.setAttribute('data-color-mode', mode);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // 补充分号
            if (mediaQuery.matches) {
                document.documentElement.setAttribute('data-color-mode', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-mode', 'light');
            }
        }
        window.dispatchEvent(new Event("colorSchemeChange"));
    };

    return (
        <footer>
            <Helmet>
                <meta name="msvalidate.01" content="FC7BFAB0FDEB9AC40AFA51E7B1BA491B" />
                <link rel="alternate" type="application/rss+xml" title={siteName} href="/sub/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title={siteName} href="/sub/atom.xml" />
                <link rel="alternate" type="application/json" title={siteName} href="/sub/rss.json" />
                {/* 微软网站统计代码（确保脚本语法正确） */}
                <script type="text/javascript">
                    (function(c,l,a,r,i,t,y){
                        c[a] = c[a] || function(){ (c[a].q = c[a].q || []).push(arguments); };
                        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
                        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
                    })(window, document, "clarity", "script", "t4htrwnwuk");
                </script>
            </Helmet>
            <div className="flex flex-col mb-8 space-y-2 justify-center items-center t-primary ani-show">
                {footerHtml && <div dangerouslySetInnerHTML={{ __html: footerHtml }} />}
                <p className='text-sm text-neutral-500 font-normal link-line'>
                    <span onDoubleClick={() => {
                        if (doubleClickTimes >= 2) { // 修复括号空格，避免语法歧义
                            setDoubleClickTimes(0);
                            if (!loginEnabled) { // 修复括号空格
                                setIsOpened(true);
                            }
                        } else {
                            setDoubleClickTimes(doubleClickTimes + 1);
                        }
                    }}>
                        © {new Date().getFullYear()} Powered by <a className='hover:underline' href="https://github.com/openRin/Rin" target="_blank">Rin</a>
                    </span>
                    {config.get<boolean>('rss') && ( // 将 <> 改为 () 避免歧义
                        <>
                            <Spliter />
                            <Popup 
                                trigger={<button className="hover:underline" type="button">RSS</button>}
                                position="top center"
                                arrow={false}
                                closeOnDocumentClick
                            >
                                <div className="border-card">
                                    <p className='font-bold t-primary'>{t('footer.rss')}</p>
                                    <p>
                                        <a href='/sub/rss.xml'>RSS</a> <Spliter />
                                        <a href='/sub/atom.xml'>Atom</a> <Spliter />
                                        <a href='/sub/rss.json'>JSON</a>
                                    </p>
                                </div>
                            </Popup>
                        </>
                    )}
                </p>
                <div className="w-fit-content inline-flex rounded-full border border-zinc-200 p-[3px] dark:border-zinc-700">
                    <ThemeButton mode='light' current={modeState} label="Toggle light mode" icon="ri-sun-line" onClick={setMode} />
                    <ThemeButton mode='system' current={modeState} label="Toggle system mode" icon="ri-computer-line" onClick={setMode} />
                    <ThemeButton mode='dark' current={modeState} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode} />
                </div>
            </div>
            {/* 5.1la网站挂件（修复属性命名） */}
            <script 
                id="LA-DATA-WIDGET" 
                crossOrigin="anonymous"  // 修复为驼峰式
                charSet="UTF-8"         // 修复为驼峰式
                src="https://v6-widget.51.la/v6/3MOp3pz44aY9Pq6y/quote.js?theme=0&f=12&display=0,0,1,1,0,0,0,0"
            />
            
            <LoginModal />
        </footer>
    );
}

function Spliter() {
    return (
        <span className='px-1'>|</span> // 简化结构，避免多余换行
    );
}

function ThemeButton({ 
    current, 
    mode, 
    label, 
    icon, 
    onClick 
}: { 
    current: ThemeMode; 
    label: string; 
    mode: ThemeMode; 
    icon: string; 
    onClick: (mode: ThemeMode) => void; 
}) {
    return (
        <button 
            aria-label={label} 
            type="button" 
            onClick={() => onClick(mode)}
            className={`rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 t-primary ${current === mode ? "bg-w rounded-full shadow-xl shadow-light" : ""}`}
        >
            <i className={icon} />
        </button>
    );
}

export default Footer;
