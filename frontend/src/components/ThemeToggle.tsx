import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle(){
  const [dark, setDark] = useState<boolean>(()=>{
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(()=>{
    const root = document.documentElement;
    if(dark){ root.classList.add('dark'); localStorage.setItem('theme','dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light'); }
  }, [dark]);

  return (
    <button onClick={()=>setDark(d=>!d)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
      <span className="text-sm">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
