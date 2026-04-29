import React, { useState } from 'react';
import { Play, StepForward, StepBack, RotateCcw, AlertTriangle, CheckCircle, Lock, Unlock, ShieldAlert, Box } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'struct-lifetime',
    title: '進階一：結構體中的生命週期',
    description: '當 Struct 儲存引用時，必須宣告生命週期參數，告訴編譯器「這個 Struct 實例的存活時間，絕對不能超過它所持有的引用」。',
    code: [
      "struct Excerpt<'a> {",         // 0
      "    part: &'a str,",           // 1
      "}",                            // 2
      "fn main() {",                  // 3
      "    let i;",                   // 4
      "    {",                        // 5
      "        let text = String::from(\"Rust\");", // 6
      "        i = Excerpt { part: &text };",       // 7
      "    } // text 在此被丟棄",       // 8
      "    println!(\"{}\", i.part);",// 9
      "}"                             // 10
    ],
    steps: [
      { line: 0, message: "宣告 Struct。<'a> 標示了這個結構體持有引用的生命週期。", memory: { outer: [], inner: null } },
      { line: 4, message: "宣告變數 `i`，準備用來存放 Excerpt 實例。", memory: { outer: [{ name: 'i', val: '未初始化', state: 'active', type: 'struct' }], inner: null } },
      { line: 5, message: "開啟內部作用域。", memory: { outer: [{ name: 'i', val: '未初始化', state: 'active', type: 'struct' }], inner: [] } },
      { line: 6, message: "創建字串 `text`。", memory: { 
          outer: [{ name: 'i', val: '未初始化', state: 'active', type: 'struct' }], 
          inner: [{ name: 'text', val: '"Rust"', state: 'active', type: 'owner' }] 
        } 
      },
      { line: 7, message: "創建 Excerpt 實例。此時 i.part 借用了 text。編譯器記錄：i 的生命週期被限制在 text 的生命週期內。", memory: { 
          outer: [{ name: 'i', val: 'Excerpt { part: &text }', state: 'active', type: 'struct', pointsTo: 'text' }], 
          inner: [{ name: 'text', val: '"Rust"', state: 'active', type: 'owner', locks: { read: 1, write: 0 } }] 
        } 
      },
      { line: 8, message: "內部作用域結束，`text` 被丟棄。但 `i` 仍然存活，導致 `i` 內部包含了一個懸空引用！", status: 'error', errorMsg: "`text` 不夠長壽", memory: { 
          outer: [{ name: 'i', val: 'Excerpt { part: 懸空引用 }', state: 'error', type: 'struct', pointsTo: 'text' }], 
          inner: [{ name: 'text', val: '已丟棄', state: 'dropped', type: 'owner' }] 
        } 
      },
      { line: 9, message: "編譯失敗！嘗試存取無效的引用 `i.part`。", status: 'error', memory: { 
          outer: [{ name: 'i', val: 'Excerpt { part: 懸空引用 }', state: 'error', type: 'struct', pointsTo: 'text' }], 
          inner: [{ name: 'text', val: '已回收', state: 'dropped', type: 'owner' }] 
        } 
      }
    ]
  },
  {
    id: 'borrow-conflict',
    title: '進階二：借用衝突 (讀寫互斥)',
    description: 'Rust 借用規則：「在任何給定的時間點，你可以擁有任意數量的不可變引用(&)，或剛好一個可變引用(&mut)，但不能同時擁有兩者」。這被稱為 Aliasing XOR Mutation。',
    code: [
      "fn main() {",
      "    let mut s = String::from(\"hello\");", // 1
      "    let r1 = &s; // 不可變借用",              // 2
      "    let r2 = &s; // 不可變借用",              // 3
      "    let r3 = &mut s; // 可變借用 (衝突！)",   // 4
      "    println!(\"{}, {}, {}\", r1, r2, r3);", // 5
      "}"
    ],
    steps: [
      { line: 0, message: "程式開始。", memory: { outer: [], inner: null } },
      { line: 1, message: "宣告可變變數 `s`，擁有字串的擁有權。", memory: { 
          outer: [{ name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 0, write: 0 }, isMut: true }], inner: null 
        } 
      },
      { line: 2, message: "宣告不可變引用 `r1`。`s` 被加上了 1 個「讀取鎖」。", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 1, write: 0 }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 3, message: "宣告不可變引用 `r2`。多個讀取是安全的，`s` 現在有 2 個「讀取鎖」。", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 2, write: 0 }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' },
            { name: 'r2', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 4, message: "宣告可變引用 `r3` 嘗試獲取「寫入鎖」。失敗！因為 `s` 身上還有未釋放的讀取鎖（r1, r2 稍後還會用到）。", status: 'error', errorMsg: "cannot borrow `s` as mutable because it is also borrowed as immutable", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'error', type: 'owner', locks: { read: 2, write: '拒絕' }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' },
            { name: 'r2', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' },
            { name: 'r3', val: '&mut s (失敗)', state: 'error', type: 'mut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 5, message: "編譯階段被借用檢查器擋下。", status: 'error', memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'error', type: 'owner', locks: { read: 2, write: '拒絕' }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' },
            { name: 'r2', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' },
            { name: 'r3', val: '&mut s', state: 'error', type: 'mut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      }
    ]
  },
  {
    id: 'nll',
    title: '進階三：非詞法生命週期 (NLL)',
    description: '在現代 Rust 中，引用的生命週期不再死板地跟隨大括號結束。如果一個引用「最後一次被使用」的地方提早結束，編譯器會提早釋放它的鎖。',
    code: [
      "fn main() {",
      "    let mut s = String::from(\"hello\");", // 1
      "    let r1 = &s; // 不可變借用",              // 2
      "    println!(\"{}\", r1);",                 // 3
      "    // --- NLL: r1 之後再也沒被使用 ---",      // 4
      "    let r2 = &mut s; // 可變借用 (成功！)",   // 5
      "    r2.push_str(\" world\");",              // 6
      "    println!(\"{}\", r2);",                 // 7
      "}"
    ],
    steps: [
      { line: 0, message: "程式開始。", memory: { outer: [], inner: null } },
      { line: 1, message: "宣告擁有者 `s`。", memory: { 
          outer: [{ name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 0, write: 0 }, isMut: true }], inner: null 
        } 
      },
      { line: 2, message: "宣告不可變引用 `r1`。`s` 獲得 1 個讀取鎖。", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 1, write: 0 }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 3, message: "使用 `r1` 印出值。這是 `r1` 最後一次被使用。", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 1, write: 0 }, isMut: true },
            { name: 'r1', val: '&s', state: 'active', type: 'immut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 4, message: "魔法發生 (NLL)：編譯器分析發現 r1 往後再也不會被用到了！因此提早結束 r1 的生命週期，並釋放 s 的讀取鎖。", status: 'success', memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 0, write: 0 }, isMut: true },
            { name: 'r1', val: '提前結束 (NLL)', state: 'dropped', type: 'immut_ref' }
          ], inner: null 
        } 
      },
      { line: 5, message: "宣告可變引用 `r2`。因為 s 的讀取鎖已經被清空，現在可以安全地獲取「寫入鎖」！", memory: { 
          outer: [
            { name: 's', val: '"hello"', state: 'active', type: 'owner', locks: { read: 0, write: 1 }, isMut: true },
            { name: 'r1', val: '提前結束 (NLL)', state: 'dropped', type: 'immut_ref' },
            { name: 'r2', val: '&mut s', state: 'active', type: 'mut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 6, message: "透過可變引用 `r2` 修改字串內容。", memory: { 
          outer: [
            { name: 's', val: '"hello world"', state: 'active', type: 'owner', locks: { read: 0, write: 1 }, isMut: true },
            { name: 'r1', val: '提前結束 (NLL)', state: 'dropped', type: 'immut_ref' },
            { name: 'r2', val: '&mut s', state: 'active', type: 'mut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      },
      { line: 7, message: "編譯成功並執行完畢。", status: 'success', memory: { 
          outer: [
            { name: 's', val: '"hello world"', state: 'active', type: 'owner', locks: { read: 0, write: 1 }, isMut: true },
            { name: 'r1', val: '提前結束', state: 'dropped', type: 'immut_ref' },
            { name: 'r2', val: '&mut s', state: 'active', type: 'mut_ref', pointsTo: 's' }
          ], inner: null 
        } 
      }
    ]
  }
];

export default function AdvancedRustLifetimes() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const scenario = SCENARIOS[activeScenarioIdx];
  const stepData = scenario.steps[currentStep];

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleScenarioChange = (idx) => {
    setActiveScenarioIdx(idx);
    setCurrentStep(0);
  };

  // 進階渲染變數方塊
  const renderVar = (v, idx) => {
    const isError = v.state === 'error';
    const isDropped = v.state === 'dropped';
    const isMutRef = v.type === 'mut_ref';
    const isOwner = v.type === 'owner';
    const isStruct = v.type === 'struct';

    let bgClass = 'bg-gray-100 border-gray-300 text-gray-500'; // Default / Dropped
    if (isError) bgClass = 'bg-red-50 border-red-400 text-red-900 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]';
    else if (!isDropped) {
      if (isMutRef) bgClass = 'bg-amber-50 border-amber-400 text-amber-900';
      else if (isStruct) bgClass = 'bg-purple-50 border-purple-300 text-purple-900';
      else bgClass = 'bg-blue-50 border-blue-300 text-blue-900';
    }

    return (
      <div key={idx} className={`p-4 rounded-lg mb-3 flex flex-col border-2 transition-all duration-300 ${bgClass}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-xl">{v.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isError ? 'bg-red-200' : 'bg-black/10'}`}>
              {isOwner ? (v.isMut ? '可變擁有者' : '擁有者') : 
               isStruct ? 'Struct 實例' : 
               isMutRef ? '可變借用 (&mut)' : '不可變借用 (&)'}
            </span>
          </div>
          
          {/* Locks Visualization for Owners */}
          {isOwner && v.locks && !isDropped && (
            <div className="flex space-x-3 bg-white px-3 py-1.5 rounded-md border shadow-sm">
              <div className="flex items-center space-x-1" title="讀取鎖 (Shared Locks)">
                <Unlock size={14} className={v.locks.read > 0 ? "text-blue-600" : "text-gray-300"} />
                <span className={`font-mono text-sm ${v.locks.read > 0 ? "text-blue-700 font-bold" : "text-gray-400"}`}>
                  {v.locks.read}
                </span>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="flex items-center space-x-1" title="寫入鎖 (Exclusive Lock)">
                <Lock size={14} className={v.locks.write === 1 ? "text-amber-600" : v.locks.write === '拒絕' ? "text-red-500" : "text-gray-300"} />
                <span className={`font-mono text-sm ${v.locks.write === 1 ? "text-amber-700 font-bold" : v.locks.write === '拒絕' ? "text-red-600 font-bold" : "text-gray-400"}`}>
                  {v.locks.write}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1">
          <div className={`font-mono text-sm py-1.5 px-3 rounded-md border ${
            isError ? 'bg-red-100 border-red-300' : 
            isDropped ? 'bg-gray-200 border-transparent opacity-60' : 'bg-white/80 border-black/10'
          }`}>
            {isStruct ? <Box size={14} className="inline mr-2 text-purple-600"/> : null}
            {v.val}
          </div>

          {v.pointsTo && !isDropped && (
            <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-sm bg-white/50 px-2 py-1 rounded">
              <span className="text-black/50">指向 &rarr;</span>
              <span className={`font-mono font-bold ${isError ? 'text-red-600 line-through' : isMutRef ? 'text-amber-700' : 'text-blue-700'}`}>
                {v.pointsTo}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <ShieldAlert size={120} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Rust 借用檢查器 <span className="text-orange-600">進階視覺化</span></h1>
          <p className="text-slate-600 max-w-3xl">
            深入探討 Struct 生命週期、讀寫鎖互斥（Aliasing XOR Mutation）以及非詞法生命週期（NLL）的底層運作邏輯。
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(idx)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeScenarioIdx === idx 
                    ? 'bg-slate-800 text-white shadow-md ring-2 ring-orange-500 ring-offset-2' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="mt-5 text-sm text-slate-700 bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start">
            <Lock className="shrink-0 mr-3 text-orange-400 mt-0.5" size={18} />
            <p className="leading-relaxed">{scenario.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：程式碼區域 */}
          <div className="bg-[#0f172a] rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-800">
            <div className="bg-[#1e293b] px-4 py-3 text-slate-300 text-sm font-mono flex items-center shadow-sm">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-4"></div>
              <span>advanced_lifetimes.rs</span>
            </div>
            <div className="p-5 font-mono text-sm sm:text-base overflow-x-auto flex-1 leading-loose">
              {scenario.code.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`flex px-2 py-0.5 rounded transition-colors ${
                    stepData.line === idx ? 'bg-blue-900/40 border-l-4 border-blue-400' : 'border-l-4 border-transparent text-slate-400'
                  }`}
                >
                  <span className="w-8 select-none opacity-40 text-right mr-4">{idx + 1}</span>
                  <span className={stepData.line === idx ? 'text-blue-50 font-semibold' : ''}>
                    {line.replace(/ /g, "\u00A0")}
                  </span>
                </div>
              ))}
            </div>
            
            {/* 控制面板 */}
            <div className="bg-[#1e293b] p-4 flex items-center justify-between border-t border-slate-700">
              <div className="text-slate-400 text-sm font-mono bg-black/20 px-3 py-1 rounded-full">
                Step {currentStep + 1} / {scenario.steps.length}
              </div>
              <div className="flex space-x-3">
                <button onClick={handleReset} className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors bg-slate-800" title="重新開始">
                  <RotateCcw size={20} />
                </button>
                <button onClick={handlePrev} disabled={currentStep === 0} className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors bg-slate-800" title="上一步">
                  <StepBack size={20} />
                </button>
                <button onClick={handleNext} disabled={currentStep === scenario.steps.length - 1} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors flex items-center space-x-2 font-medium shadow-md">
                  <span>下一步</span>
                  <StepForward size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* 右側：記憶體/作用域視覺化 */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center">
                編譯器視角 (Borrow Checker)
              </h2>
              <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center"><Unlock size={12} className="mr-1 text-blue-500"/>讀取鎖(多個)</span>
                <span className="flex items-center"><Lock size={12} className="mr-1 text-amber-500"/>寫入鎖(唯一)</span>
              </div>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50/50">
              {/* 狀態訊息框 */}
              <div className={`p-4 rounded-xl mb-6 border shadow-sm transition-all duration-300 ${
                stepData.status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
                stepData.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-start">
                  {stepData.status === 'error' ? <AlertTriangle className="mr-3 mt-0.5 shrink-0" size={24} /> : 
                   stepData.status === 'success' ? <CheckCircle className="mr-3 mt-0.5 shrink-0" size={24} /> :
                   <Play className="mr-3 mt-0.5 shrink-0 text-blue-500" size={24} />}
                  <div>
                    <p className="font-medium text-base leading-relaxed">{stepData.message}</p>
                    {stepData.errorMsg && (
                      <p className="mt-3 font-mono text-sm bg-red-100 p-3 rounded-lg text-red-900 border border-red-200 font-semibold shadow-inner">
                        {'>'} {stepData.errorMsg}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 作用域圖解 */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">記憶體與作用域</h3>
                
                {/* 外部作用域 */}
                <div className="border-2 border-slate-300 rounded-xl p-5 relative bg-white shadow-sm">
                  <div className="absolute -top-3 left-4 bg-white px-3 py-0.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                    Main 作用域 ('a)
                  </div>
                  
                  {stepData.memory.outer.length === 0 && !stepData.memory.inner && (
                    <div className="text-slate-400 text-center py-6 text-sm font-medium">尚未分配變數</div>
                  )}

                  {stepData.memory.outer.map((v, i) => renderVar(v, i))}

                  {/* 內部作用域 */}
                  {stepData.memory.inner !== null && (
                    <div className="border-2 border-dashed border-slate-400 bg-slate-50 rounded-xl p-5 mt-6 relative">
                      <div className="absolute -top-3 left-4 bg-slate-50 px-3 py-0.5 rounded-full border border-dashed border-slate-400 text-xs font-bold text-slate-600">
                        內部作用域 ('b)
                      </div>
                      
                      {stepData.memory.inner.length === 0 && (
                        <div className="text-slate-400 text-center py-4 text-sm font-medium">無變數</div>
                      )}
                      
                      {stepData.memory.inner.map((v, i) => renderVar(v, i))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
