import numpy as np, wave, sys
SR=44100; rng=np.random.default_rng(7)
def save(name,x):
    x=x/ (np.max(np.abs(x))+1e-9)*0.9
    with wave.open(f'sfx/{name}.wav','w') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes())
def env(n,a,r):
    e=np.ones(n);A=int(a*SR);R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-R:]=np.linspace(1,0,R)**2; return e
def lp(x,c):  # one-pole lowpass with time-varying cutoff (array or float)
    c=np.broadcast_to(c,x.shape); y=np.zeros_like(x); s=0
    for i in range(len(x)):
        a=1-np.exp(-2*np.pi*c[i]/SR); s+=a*(x[i]-s); y[i]=s
    return y
t=lambda d: np.arange(int(d*SR))/SR
# whoosh: ruído com filtro que sobe e desce
n=int(0.7*SR); cut=200+3800*np.sin(np.linspace(0,np.pi,n))**2
save('whoosh', lp(rng.standard_normal(n),cut)*env(n,0.25,0.35))
# hit: grave curto + estalo
d=t(0.6); save('hit', np.sin(2*np.pi*(90-50*d)*d)*np.exp(-d*9)+0.3*rng.standard_normal(len(d))*np.exp(-d*60))
# boom: impacto cinematográfico longo
d=t(1.8); save('boom', np.sin(2*np.pi*(60-25*d)*d)*np.exp(-d*2.5)+0.6*lp(rng.standard_normal(len(d)),400)*np.exp(-d*3))
# tick
d=t(0.06); save('tick', np.sin(2*np.pi*2400*d)*np.exp(-d*120))
# pop
d=t(0.12); save('pop', np.sin(2*np.pi*(700+900*d)*d)*np.exp(-d*45))
# stamp: baque + papel
d=t(0.35); save('stamp', np.sin(2*np.pi*110*d)*np.exp(-d*25)+0.5*rng.standard_normal(len(d))*np.exp(-d*40))
# riser: ruído + tom subindo
d=t(2.2); save('riser', (lp(rng.standard_normal(len(d)),300+5000*(d/2.2)**2)*0.7+0.3*np.sin(2*np.pi*(200+600*(d/2.2)**2)*d))*(d/2.2)**2)
# wind
n=int(3*SR); save('wind', lp(rng.standard_normal(n),250+150*np.sin(np.linspace(0,6,n)))*env(n,0.8,0.8))
# water (gotas/bolhas)
d=t(2.0); x=np.zeros(len(d))
for k in rng.integers(0,len(d)-3000,40):
    f=rng.uniform(500,1400); dd=np.arange(2500)/SR; x[k:k+2500]+=np.sin(2*np.pi*f*(1+dd*8)*dd)*np.exp(-dd*60)
save('water', x+0.15*lp(rng.standard_normal(len(d)),900))
# fire (estalos)
d=t(3.0); x=0.3*lp(rng.standard_normal(len(d)),600)
for k in rng.integers(0,len(d)-400,90): x[k:k+400]+=rng.uniform(.3,1)*rng.standard_normal(400)*np.exp(-np.arange(400)/60)
save('fire',x)
print('ok')
