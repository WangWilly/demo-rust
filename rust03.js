import React, { useState } from 'react';
import { Play, StepForward, StepBack, RotateCcw, Box, Share2, Activity, Layers, Database, ArrowRight } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'box',
    title: 'Box<T>：單一擁有權的堆積分配',
    description: 'Box 是最簡單的智慧指標。它將資料從 Stack (堆疊) 搬到 Heap (堆積)，並在 Stack 上留下一個指標。它依然遵守「單一擁有權」規則，可以發生 Move (轉移)。',
    code: [
      "fn main() {",
      "    // b 被分配在 Stack，但它的資料 (5) 在 Heap",
      "    let b = Box::new(5);",                     // 2
      "    ",
      "    // 擁有權轉移 (Move) 給 c",
      "    let c = b;",                               // 5
      "    ",
      "    // println!(\"{}\", b); // 錯誤！b 已失效",   // 7
      "} // c 被丟棄，Heap 上的資料隨之釋放"         // 8
    ],
    steps: [
      { line: 0, message: "程式開始。", stack: [], heap: [] },
      { line: 2, message: "呼叫 Box::new(5)。在 Heap 上分配記憶體存入 5，並在 Stack 建立指標 `b` 指向它。", 
        stack: [{ name: 'b', type: 'Box', pointsTo: 'heap_1', valid: true }], 
        heap: [{ id: 'heap_1', val: '5', refs: 1, type: 'data' }] 
      },
      { line: 5, message: "將 b 賦值給 c。因為 Box 遵守擁有權規則，這會發生 Move (轉移)。b 失效，改由 c 掌管 Heap 上的資料。", 
        stack: [
          { name: 'b', type: 'Box', pointsTo: 'heap_1', valid: false },
          { name: 'c', type: 'Box', pointsTo: 'heap_1', valid: true }
        ], 
        heap: [{ id: 'heap_1', val: '5', refs: 1, type: 'data' }] 
      },
      { line: 7, message: "此時如果嘗試使用 b 會引發編譯錯誤，因為它的擁有權已經被轉移了。", 
        stack: [
          { name: 'b', type: 'Box', pointsTo: 'heap_1', valid: false },
          { name: 'c', type: 'Box', pointsTo: 'heap_1', valid: true }
        ], 
        heap: [{ id: 'heap_1', val: '5', refs: 1, type: 'data' }] 
      },
      { line: 8, message: "離開作用域，變數 c 被丟棄 (Drop)。因為 c 是 Heap 資料的唯一擁有者，Heap 上的記憶體也被安全釋放。", 
        stack: [], 
        heap: [] 
      }
    ]
  },
  {
    id: 'rc',
    title: 'Rc<T>：單執行緒的多重擁有權',
    description: 'Rc (Reference Counted) 允許一個資料有多個擁有者。它會在 Heap 上維護一個「引用計數 (Strong Count)」。每 Clone 一次計數加 1，Drop 一次減 1。歸零時才釋放記憶體。',
    code: [
      "use std::rc::Rc;",
      "fn main() {",
      "    let r1 = Rc::new(String::from(\"共用資料\"));", // 2
      "    let r2;",                                     // 3
      "    {",                                           // 4
      "        // 增加引用計數，不會複製底層資料",
      "        r2 = Rc::clone(&r1);",                    // 6
      "    } // r2 離開作用域，計數減 1",                // 7
      "} // r1 離開作用域，計數歸零，釋放記憶體"          // 8
    ],
    steps: [
      { line: 1, message: "程式開始。", stack: [], heap: [] },
      { line: 2, message: "建立 Rc。Heap 上除了存放資料，還多了一個 Strong Count (目前為 1)。", 
        stack: [{ name: 'r1', type: 'Rc', pointsTo: 'heap_rc', valid: true }], 
        heap: [{ id: 'heap_rc', val: '"共用資料"', refs: 1, type: 'rc_data' }] 
      },
      { line: 3, message: "宣告變數 r2。", 
        stack: [
          { name: 'r1', type: 'Rc', pointsTo: 'heap_rc', valid: true },
          { name: 'r2', type: 'Rc', pointsTo: null, valid: false }
        ], 
        heap: [{ id: 'heap_rc', val: '"共用資料"', refs: 1, type: 'rc_data' }] 
      },
      { line: 6, message: "呼叫 Rc::clone(&r1)。這不會複製字串本身！它只是讓 r2 也指向 Heap，並將 Heap 上的 Strong Count 加 1 變成 2。", 
        stack: [
          { name: 'r1', type: 'Rc', pointsTo: 'heap_rc', valid: true },
          { name: 'r2', type: 'Rc', pointsTo: 'heap_rc', valid: true, isInner: true }
        ], 
        heap: [{ id: 'heap_rc', val: '"共用資料"', refs: 2, type: 'rc_data' }] 
      },
      { line: 7, message: "內部作用域結束，r2 被丟棄。Heap 上的 Strong Count 減 1 變回 1。資料沒有被釋放，因為 r1 還在用！", 
        stack: [{ name: 'r1', type: 'Rc', pointsTo: 'heap_rc', valid: true }], 
        heap: [{ id: 'heap_rc', val: '"共用資料"', refs: 1, type: 'rc_data' }] 
      },
      { line: 8, message: "main 結束，r1 被丟棄。Strong Count 減 1 變成 0。這時 Rc 知道已經沒有人需要它了，安全釋放 Heap 記憶體。", 
        stack: [], 
        heap: [] 
      }
    ]
  },
  {
    id: 'arc',
    title: 'Arc<T>：多執行緒的安全共享',
    description: 'Arc (Atomic Reference Counted) 和 Rc 幾乎一樣，差別在於它的計數器使用了「原子操作 (Atomic)」，因此可以安全地跨越執行緒 (Thread) 分享，不會有 Data Race。',
    code: [
      "use std::sync::Arc;",
      "use std::thread;",
      "fn main() {",
      "    let arc1 = Arc::new(vec![1, 2, 3]);",         // 3
      "    let arc2 = Arc::clone(&arc1);",               // 4
      "    ",
      "    // 啟動新執行緒，並將 arc2 的擁有權 Move 進去",
      "    let handle = thread::spawn(move || {",        // 7
      "        println!(\"{:?}\", arc2);",               // 8
      "    }); // 執行緒結束，arc2 被丟棄，計數減 1",      // 9
      "    ",
      "    handle.join().unwrap();",                     // 11
      "} // main 結束，arc1 被丟棄，計數歸零，釋放"       // 12
    ],
    steps: [
      { line: 2, message: "程式開始。", stack: [], heap: [] },
      { line: 3, message: "建立 Arc。在 Heap 上分配陣列，並建立具有 Atomic 特性的 Strong Count (目前為 1)。", 
        stack: [{ name: 'arc1', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'main' }], 
        heap: [{ id: 'heap_arc', val: '[1, 2, 3]', refs: 1, type: 'arc_data', isAtomic: true }] 
      },
      { line: 4, message: "Clone Arc。Strong Count 安全地增加到 2。", 
        stack: [
          { name: 'arc1', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'main' },
          { name: 'arc2', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'main' }
        ], 
        heap: [{ id: 'heap_arc', val: '[1, 2, 3]', refs: 2, type: 'arc_data', isAtomic: true }] 
      },
      { line: 7, message: "啟動新執行緒！arc2 被 Move 到 Worker 執行緒的 Stack 中。跨執行緒共享達成！", 
        stack: [
          { name: 'arc1', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'main' },
          { name: 'arc2', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'worker' }
        ], 
        heap: [{ id: 'heap_arc', val: '[1, 2, 3]', refs: 2, type: 'arc_data', isAtomic: true }] 
      },
      { line: 9, message: "Worker 執行緒執行完畢。其 Stack 上的 arc2 被丟棄，Atomic Strong Count 安全減至 1。", 
        stack: [{ name: 'arc1', type: 'Arc', pointsTo: 'heap_arc', valid: true, thread: 'main' }], 
        heap: [{ id: 'heap_arc', val: '[1, 2, 3]', refs: 1, type: 'arc_data', isAtomic: true }] 
      },
      { line: 12, message: "Main 執行緒結束。arc1 被丟棄，Atomic Strong Count 歸零，Heap 上的記憶體被釋放。", 
        stack: [], 
        heap: [] 
      }
    ]
  }
];

export default function RustSmartPointers() {
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

  const getIcon = (type) => {
    switch(type) {
      case 'Box': return <Box size={16} className="text-amber-600" />;
      case 'Rc': return <Share2 size={16} className="text-blue-600" />;
      case 'Arc': return <Activity size={16} className="text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            Rust 智慧指標 <span className="ml-3 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">Box</span> <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Rc</span> <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Arc</span>
          </h1>
          <p className="text-slate-600 max-w-4xl mt-2">
            當標準的生命週期與單一擁有權無法滿足需求時，我們可以將資料放到 Heap 上，並透過智慧指標來管理它們的存活時間。
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(idx)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeScenarioIdx === idx 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* 狀態訊息 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start">
          <Play className="mr-3 mt-1 shrink-0 text-emerald-500 fill-emerald-100" size={24} />
          <p className="text-lg font-medium text-slate-700 leading-relaxed">{stepData.message}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：程式碼區域 */}
          <div className="lg:col-span-1 bg-[#0f172a] rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-800">
            <div className="bg-[#1e293b] px-4 py-3 text-slate-300 text-sm font-mono flex items-center">
              <span>main.rs</span>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto flex-1 leading-loose">
              {scenario.code.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`flex px-2 py-0.5 rounded transition-colors ${
                    stepData.line === idx ? 'bg-blue-900/50 border-l-4 border-blue-400' : 'border-l-4 border-transparent text-slate-400'
                  }`}
                >
                  <span className="w-6 select-none opacity-40 text-right mr-3">{idx + 1}</span>
                  <span className={stepData.line === idx ? 'text-blue-50' : ''}>
                    {line.replace(/ /g, "\u00A0")}
                  </span>
                </div>
              ))}
            </div>
            
            {/* 控制面板 */}
            <div className="bg-[#1e293b] p-4 flex justify-between border-t border-slate-700">
              <button onClick={handlePrev} disabled={currentStep === 0} className="p-2 rounded-lg bg-slate-700 text-white disabled:opacity-30 transition-colors">
                <StepBack size={20} />
              </button>
              <button onClick={handleReset} className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors" title="重新開始">
                <RotateCcw size={20} />
              </button>
              <button onClick={handleNext} disabled={currentStep === scenario.steps.length - 1} className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors flex items-center space-x-2 font-bold shadow-md">
                <span>下一步</span>
                <StepForward size={20} />
              </button>
            </div>
          </div>

          {/* 右側：記憶體視覺化 (Stack & Heap) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stack 區域 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center">
                <Layers className="text-indigo-600 mr-2" size={18} />
                <h2 className="font-bold text-indigo-900">Stack (堆疊)</h2>
                <span className="ml-auto text-xs text-indigo-500 bg-indigo-100 px-2 py-1 rounded-full">指標儲存區</span>
              </div>
              <div className="p-4 flex-1 bg-slate-50 relative">
                {stepData.stack.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">Stack 為空</div>
                ) : (
                  <div className="space-y-3">
                    {stepData.stack.map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl border-2 transition-all ${
                        !item.valid ? 'bg-slate-200 border-slate-300 opacity-50' : 
                        item.thread === 'worker' ? 'bg-teal-50 border-teal-300' :
                        item.isInner ? 'bg-indigo-50 border-indigo-300 ml-6 relative' : 'bg-white border-indigo-300 shadow-sm'
                      }`}>
                        {item.isInner && (
                          <div className="absolute -left-6 top-1/2 w-4 h-px bg-slate-400"></div>
                        )}
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-mono font-bold text-lg ${!item.valid ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          {item.thread && (
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                              item.thread === 'main' ? 'bg-blue-100 text-blue-700' : 'bg-teal-500 text-white'
                            }`}>
                              {item.thread} Thread
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="flex items-center space-x-1 mr-3 bg-white/60 px-2 py-0.5 rounded border border-black/5">
                            {getIcon(item.type)}
                            <span className="font-semibold text-slate-600">{item.type} 指標</span>
                          </div>
                          {item.pointsTo && item.valid && (
                            <div className="flex items-center text-indigo-600">
                              <ArrowRight size={14} className="mr-1" />
                              <span className="font-mono text-xs">指向 Heap</span>
                            </div>
                          )}
                          {!item.valid && <span className="text-xs text-red-500 font-bold ml-2">已轉移/失效</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Heap 區域 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center">
                <Database className="text-emerald-600 mr-2" size={18} />
                <h2 className="font-bold text-emerald-900">Heap (堆積)</h2>
                <span className="ml-auto text-xs text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">實際資料區</span>
              </div>
              <div className="p-4 flex-1 bg-slate-50">
                {stepData.heap.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">Heap 為空</div>
                ) : (
                  <div className="space-y-4 h-full flex flex-col justify-center">
                    {stepData.heap.map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border-2 shadow-sm ${
                        item.type === 'rc_data' ? 'bg-blue-50 border-blue-300' :
                        item.type === 'arc_data' ? 'bg-purple-50 border-purple-300' :
                        'bg-amber-50 border-amber-300'
                      }`}>
                        
                        {(item.type === 'rc_data' || item.type === 'arc_data') && (
                          <div className="flex justify-between items-center mb-3 pb-3 border-b border-black/10">
                            <div className="flex items-center">
                              {item.isAtomic ? <Activity size={16} className="text-purple-600 mr-2"/> : <Share2 size={16} className="text-blue-600 mr-2"/>}
                              <span className="font-semibold text-sm text-slate-700">
                                {item.isAtomic ? 'Atomic ' : ''}Strong Count
                              </span>
                            </div>
                            <div className="bg-white border-2 border-slate-800 text-slate-800 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center shadow-inner">
                              {item.refs}
                            </div>
                          </div>
                        )}

                        <div className="text-center mt-2">
                          <span className="text-xs text-slate-500 block mb-1 uppercase tracking-widest font-bold">儲存的值</span>
                          <div className="font-mono text-xl text-slate-800 bg-white py-2 px-4 rounded-lg border border-black/5 inline-block shadow-sm">
                            {item.val}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
