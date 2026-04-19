const TAG_PALETTE = [
  { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', bgActive: 'bg-emerald-500' },
  { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', bgActive: 'bg-blue-500' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', bgActive: 'bg-amber-500' },
  { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', bgActive: 'bg-rose-500' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', bgActive: 'bg-indigo-500' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', bgActive: 'bg-cyan-500' },
  
  { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20', bgActive: 'bg-violet-500' },
  { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500', border: 'border-fuchsia-500/20', bgActive: 'bg-fuchsia-500' },
  { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20', bgActive: 'bg-pink-500' },
  { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', bgActive: 'bg-orange-500' },
  { bg: 'bg-lime-500/10', text: 'text-lime-500', border: 'border-lime-500/20', bgActive: 'bg-lime-500' },
  { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20', bgActive: 'bg-teal-500' },
  { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/20', bgActive: 'bg-sky-500' },
  { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', bgActive: 'bg-purple-500' },
  { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', bgActive: 'bg-yellow-500' },
  { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', bgActive: 'bg-red-500' },
  { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', bgActive: 'bg-slate-500' }
];
   
export function getTagColor(name: string) {
   let sum = 0
   for(const character of name){
     sum += character.charCodeAt(0)
   }
   const index = (sum % (TAG_PALETTE.length))
   return TAG_PALETTE[index]
    }
