import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

const GALLERY = Array.from({ length: 13 }, (_, i) => `/photos/arab-agro/${String(i + 2).padStart(2, '0')}.jpg`);

const PLAN_ITEMS = [
  'ভেজিটেবল চাষ — করলা, মরিচ, লাউ, টমেটোসহ উচ্চ চাহিদার সব ধরনের সবজি সংযোজন করা হয়েছে।',
  'রপ্তানি চুক্তি সম্পন্ন — দুবাই আল আবির মার্কেট। সেখান থেকে মিশর, ইরান ও কাতারেও রি-এক্সপোর্ট হবে ইনশাআল্লাহ।',
  'পশুপালন ও ডেইরি — ফার্মে প্রথম ধাপে ১০০টি গরু ও ৩০০টি বকরি থাকবে। লক্ষ্যমাত্রা ৫ বছরে ১০০০ গরু ও ৩০০০ বকরি। দক্ষ এনালিস্ট টিমের পরামর্শক্রমে সময় ও আবহাওয়া বুঝে গরু ও বকরি ফার্মে সংযোজন করা হবে।',
];

const INCOME_ITEMS = [
  'আন্তর্জাতিক বাজারে প্রবেশ — লোকাল মার্কেটের চেয়ে আন্তর্জাতিক মার্কেট থেকে প্রায় দ্বিগুণ মুনাফা অর্জিত হয়, বিশেষ করে ভেজিটেবল রপ্তানিতে।',
  'প্রতিমাসে একাধিক কনটেইনার দুবাই এক্সপোর্ট।',
  'ওমানের লোকাল মার্কেটে বিক্রি।',
  'প্রতি একর জমি থেকে বছরে ২-৩ বার ফসল তোলা যাবে (বিটার গার্ড, মরিচ, লাউ, টমেটো ইত্যাদি)।',
  'কোরবানির মৌসুমে গরু-বকরির উচ্চমূল্যে বিক্রি এবং গরু-বকরির বাচ্চা বিক্রি।',
  'দুগ্ধজাত পণ্যের খুচরা ও পাইকারি বিক্রি।',
];


const LIVESTOCK_GALLERY = [
  '/photos/arab-agro/livestock/l01.jpg',
  '/photos/arab-agro/livestock/l03.jpg',
  '/photos/arab-agro/livestock/l05.jpg',
  '/photos/arab-agro/livestock/l06.jpg',
  '/photos/arab-agro/livestock/f02.jpg',
  '/photos/arab-agro/livestock/f09.jpg',
  '/photos/arab-agro/livestock/f11.jpg',
  '/photos/arab-agro/livestock/f12.jpg',
];

const LIVESTOCK_TEXT = [
  'বিশ্বমানের হালাল খামার বিপ্লব — শুরু করেছি ১০০ গরু ও ৩০০ বকরির খামার দিয়ে। কিন্তু লক্ষ্য আমাদের অনেক বড় — ৫ বছরে ১০০০ গরু এবং ৩০০০ বকরির বিশাল খামার গড়ে তোলা।',
  'আমরা বিশ্বাস করি, বিশুদ্ধতা, শৃঙ্খলা ও বৈজ্ঞানিক ব্যবস্থাপনায় গড়ে ওঠা একটি খামার শুধু খাদ্য নিরাপত্তাই নয়, বরং একটি অর্থনৈতিক বিপ্লব ঘটাতে পারে।',
  'আমরা শুধু পশু পালন করছি না, আমরা গড়ে তুলছি হালাল, স্বাস্থ্যসম্মত, আন্তর্জাতিক মানের দুগ্ধ ও কোরবানির পশুর সরবরাহ চেইন। প্রতিটি গরু পায় নিয়মিত ভেটেরিনারি কেয়ারের নজরদারি, প্রতিটি বকরি বড় হয় ভালোবাসা ও পুষ্টি নিয়ে।',
  'ওমানের বুকে গড়ে তুলছি সর্বাধুনিক স্ট্যান্ডার্ডে প্রস্তুত ফিডিং, ব্রিডিং ও কেয়ার সিস্টেম। প্রতিটি পশু নির্ধারিত সময়, নির্ধারিত ঘাস, এবং ভেট কেয়ার-এ বড় হয়।',
];

const LIVESTOCK_PLAN = [
  'গরু: প্রথম ধাপে ১০০ → ৫ বছরে ১০০০',
  'বকরি: প্রথম ধাপে ৩০০ → ৫ বছরে ৩০০০',
  'দুধ, গোশত ও বাচ্চা — তিনটি সেক্টরেই আয়',
  'কোরবানি ও আন্তর্জাতিক মার্কেটের জন্য হালাল পশু সরবরাহ',
];

const LIVESTOCK_EXPORT = [
  'আমাদের নিজস্ব দুধ প্রসেসিং ও প্যাকেজিং ফ্যাক্টরি প্রস্তুত, যেখান থেকে তৈরি হবে আরব এগ্রো ব্র্যান্ডেড দুগ্ধজাত পণ্য।',
  'কোরবানির মৌসুমে নির্ধারিত পশুগুলো কয়েকগুণ দামে বিক্রি হবে ইনশাআল্লাহ।',
];

function LivestockFarm() {
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="beam-small w-full text-left">
        <div className="beam-small-inner p-4 flex items-center justify-between gap-3">
          <div>
            <p className="turmeric-glow font-bold lux-serif text-base">গরু ও বকরি খামার</p>
            <p className="sage text-xs mt-1">১০০ গরু ও ৩০০ বকরি থেকে শুরু · ৫ বছরের লক্ষ্য ১০০০ ও ৩০০০</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-yellow-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="animate-fade-in mt-3 space-y-4">
          <div className="beam-small"><div className="beam-small-inner p-4 space-y-3 text-sm leading-relaxed">
            {LIVESTOCK_TEXT.map((t, i) => <p key={i} className={i === 0 ? 'lux-body font-semibold' : 'sage'}>{t}</p>)}
          </div></div>

          <div>
            <h5 className="turmeric text-sm font-bold mb-2">আমাদের লক্ষ্য ও পরিকল্পনা</h5>
            <ul className="space-y-2 text-sm lux-body">
              {LIVESTOCK_PLAN.map((t, i) => <li key={i} className="flex gap-3"><span className="turmeric">●</span><span>{t}</span></li>)}
            </ul>
          </div>

          <div>
            <h5 className="turmeric text-sm font-bold mb-2">রপ্তানি ও ফ্যাক্টরি</h5>
            <ul className="space-y-2 text-sm lux-body">
              {LIVESTOCK_EXPORT.map((t, i) => <li key={i} className="flex gap-3"><span className="turmeric">●</span><span>{t}</span></li>)}
            </ul>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {LIVESTOCK_GALLERY.map((src, i) => (
              <button key={src} onClick={() => setLightbox(src)} className="rounded-xl overflow-hidden aspect-[4/3] border border-yellow-500/20">
                <img src={src} alt={`Livestock farm ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

export function ArabAgroContent() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="text-center">
        <h4 className="turmeric-glow text-lg font-bold lux-serif">আরব এগ্রো</h4>
        <p className="text-xs text-white/60 mt-1">লাইসেন্স: ICON CRN- 1 495697</p>
      </div>

      <div className="beam-small"><div className="beam-small-inner p-4 space-y-3 text-sm leading-relaxed">
        <p className="lux-body">
          “আরব এগ্রো” আইকন ইন্টারন্যাশনালের একটি আধুনিক ও শরিয়াহভিত্তিক কৃষি-এগ্রোফার্মের মেগা প্রকল্প। যার উদ্দেশ্য ওমান এবং মধ্যপ্রাচ্যে আন্তর্জাতিক মানসম্পন্ন কৃষিপণ্য এবং দুগ্ধজাত পণ্য উৎপাদন ও রপ্তানি করে বিপ্লব ঘটানো।
        </p>
        <p className="turmeric text-sm font-semibold">“আরব এগ্রো” শুধু একটি ফার্ম নয় — এটি একটি ভিশন, একটি রপ্তানি বিপ্লবের সূচনা।</p>
        <p className="sage">
          আরবীরা কৃষি সেক্টরে অনেকটাই অনভিজ্ঞ, তাই কৃষিপ্রধান দেশ বাংলাদেশ এই মুহুর্তে ওমানের কৃষি খাতে রাজ করে চলছে। আমরা পরীক্ষামূলকভাবে ২ বছর ওমানের কৃষিখাতে কাজ করেছি এবং সফল হয়েছি।
        </p>
        <p className="sage">
          শুনে আনন্দিত হবেন যে, বিশ্বের সবচেয়ে বৃহত্তম রপ্তানি বাজার দুবাই আল আবির মার্কেটের সাথে ইতিমধ্যে আমরা রপ্তানিচুক্তি সম্পন্ন করেছি, যা আমাদের সবজি মধ্যপ্রাচ্যের গণ্ডি পেরিয়ে মিশর, ইরান ও কাতার পর্যন্ত পৌঁছে দিতে সহায়তা করবে।
        </p>
        <p className="lux-body font-medium">
          আমাদের বিশ্বাস, এটাই সেই সময় — যখন ওমানের মাটি থেকে উৎপাদিত হালাল ও গুণগত মানসম্পন্ন কৃষিপণ্য নিয়ে “রপ্তানি বাজারে বিপ্লব” ঘটানো যাবে ইনশাআল্লাহ।
        </p>
      </div></div>

      <LivestockFarm />

      <div>
        <h5 className="turmeric text-sm font-bold mb-2">মূল প্রকল্পসমূহ</h5>
        <ol className="space-y-2 text-sm lux-body">
          {PLAN_ITEMS.map((item, i) => (
            <li key={i} className="flex gap-3"><span className="turmeric font-bold">{i + 1}.</span><span>{item}</span></li>
          ))}
        </ol>
      </div>

      <div>
        <h5 className="turmeric text-sm font-bold mb-2">আয় ও লাভের উৎস</h5>
        <ol className="space-y-2 text-sm lux-body">
          {INCOME_ITEMS.map((item, i) => (
            <li key={i} className="flex gap-3"><span className="turmeric font-bold">{i + 1}.</span><span>{item}</span></li>
          ))}
        </ol>
      </div>

      <div>
        <h5 className="turmeric text-sm font-bold mb-2">ফার্মের ছবি</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GALLERY.map((src, i) => (
            <button key={src} onClick={() => setLightbox(src)} className="rounded-xl overflow-hidden aspect-[4/3] border border-yellow-500/20">
              <img src={src} alt={`Arab Agro ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

// Placeholder for projects whose text and photos are still to come
export function PendingContent({ title }: { title: string }) {
  return (
    <div className="animate-fade-in beam-small"><div className="beam-small-inner p-6 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ border: '1px solid rgba(212,175,55,.5)' }}>
        <Clock className="w-5 h-5 text-yellow-400" />
      </div>
      <h4 className="turmeric-glow text-base font-bold lux-serif">{title}</h4>
      <p className="sage text-sm">বিস্তারিত শীঘ্রই আসছে।</p>
    </div></div>
  );
}

