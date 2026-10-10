import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return { name:'Auspice',short_name:'Auspice',description:'Your space for reflection, tarot, I Ching, astrology and feng shui.',start_url:'/sanctuary',display:'standalone',background_color:'#f8f6f2',theme_color:'#614264',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}] };
}
