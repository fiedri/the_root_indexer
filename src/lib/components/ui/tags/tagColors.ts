const TAG_PALETTE = [
   { bg: 'bg-emerald-500/10', text: 'text-emerald-500',
      border: 'border-emerald-500/20', bgActive: 'bg-emerald-500' },
   { bg: 'bg-blue-500/10', text: 'text-blue-500', border:
      'border-blue-500/20', bgActive: 'bg-blue-500' },
   { bg: 'bg-amber-500/10', text: 'text-amber-500', border:
      'border-amber-500/20', bgActive: 'bg-amber-500'},
   { bg: 'bg-rose-500/10', text: 'text-rose-500', border:
      'border-rose-500/20', bgActive: 'bg-rose-500' },
   { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border:
      'border-indigo-500/20', bgActive: 'bg-indigo-500' },
      { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border:
      'border-cyan-500/20', bgActive: 'bg-cyan-500'},
    ];
   
export function getTagColor(name: string) {
   let sum = 0
   for(const character of name){
     sum += character.charCodeAt(0)
   }
   const index = (sum % (TAG_PALETTE.length))
   return TAG_PALETTE[index]
    }
