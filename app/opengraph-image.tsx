import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Auspice — A little perspective. A deeper connection.';
export default function Image() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#f8f6f2',color:'#332735',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'90px'}}><div style={{display:'flex',flexDirection:'column',maxWidth:760}}><div style={{fontSize:30,color:'#614264',marginBottom:48}}>Auspice</div><div style={{fontFamily:'serif',fontSize:74,lineHeight:1.08}}>A little perspective. A deeper connection.</div><div style={{fontSize:24,marginTop:36,color:'#746a78'}}>Tarot · I Ching · Astrology · Feng shui</div></div><div style={{display:'flex',alignItems:'center',justifyContent:'center',width:210,height:210,borderRadius:'50%',border:'2px solid #ad97b1',color:'#614264',fontSize:150}}><svg width="132" height="132" viewBox="0 0 100 100"><path d="M50 4 L62 38 L96 50 L62 62 L50 96 L38 62 L4 50 L38 38 Z" fill="none" stroke="#614264" strokeWidth="2"/></svg></div></div>,size);
}
