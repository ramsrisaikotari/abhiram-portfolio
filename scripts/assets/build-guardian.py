"""Original Cloud Infrastructure Guardian authoring source. No third-party assets.
Polygon armor, turned mechanical cross-sections and swept conduit meshes are
baked into material batches. Movable assemblies retain local docking pivots.
Run: python3 scripts/assets/build-guardian.py
"""
import math, json, struct
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[2]
batches = defaultdict(list)
materials = [
    ('Gunmetal', [0.085, 0.12, 0.145, 1], .62, .64),
    ('Brushed steel', [.22, .30, .34, 1], .7, .46),
    ('Recess', [.018, .028, .034, 1], .3, .9),
    ('Ceramic graphite', [.115, .16, .18, 1], .4, .76),
    ('Coolant light', [.04, .28, .35, 1], .15, .35),
    ('Data indicator', [.035, .17, .09, 1], .1, .4),
    ('Amber practical', [.28, .19, .075, 1], .4, .5),
]

def face(group, mat, a, b, c):
    u = [b[i]-a[i] for i in range(3)]; v = [c[i]-a[i] for i in range(3)]
    n = [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
    length = math.sqrt(sum(x*x for x in n))
    if length < 1e-9: return
    n = [x/length for x in n]
    batches[group,mat].extend((p,n) for p in [a,b,c])

def armor(group, mat, outline, z, depth, bevel=.06):
    # Authored polygon silhouette with two chamfered edges; no runtime primitives.
    if sum(outline[i][0]*outline[(i+1)%len(outline)][1]-outline[(i+1)%len(outline)][0]*outline[i][1] for i in range(len(outline))) < 0: outline=list(reversed(outline))
    cx=sum(p[0] for p in outline)/len(outline);cy=sum(p[1] for p in outline)/len(outline)
    layers=[]
    for zz, inset in [(z-depth/2,bevel),(z-depth/2+bevel,0),(z+depth/2-bevel,0),(z+depth/2,bevel)]:
        layers.append([(x+(cx-x)*inset,y+(cy-y)*inset,zz) for x,y in outline])
    for k in range(3):
        for i in range(len(outline)):
            j=(i+1)%len(outline);a,b=layers[k][i],layers[k][j];c,d=layers[k+1][j],layers[k+1][i]
            face(group,mat,a,b,c);face(group,mat,a,c,d)
    for layer, reverse in [(layers[0],True),(layers[-1],False)]:
        center=(cx,cy,layer[0][2])
        for i in range(len(outline)):
            a,b=layer[i],layer[(i+1)%len(outline)]
            face(group,mat,center,b,a) if reverse else face(group,mat,center,a,b)

def plate(group,mat,x,y,w,h,z,d=.1,cut=.12):
    armor(group,mat,[(x-w/2+cut,y-h/2),(x+w/2-cut,y-h/2),(x+w/2,y-h/2+cut),(x+w/2,y+h/2-cut),(x+w/2-cut,y+h/2),(x-w/2+cut,y+h/2),(x-w/2,y+h/2-cut),(x-w/2,y-h/2+cut)],z,d)

def turned(group,mat,center,profile,segments=48):
    # Hollow stepped lathe profile, axis Z. Profile = (radius, depth) loop.
    x,y,z=center
    for k in range(len(profile)):
        r1,z1=profile[k];r2,z2=profile[(k+1)%len(profile)]
        for i in range(segments):
            a=i*math.tau/segments;b=(i+1)*math.tau/segments
            pts=[(x+r1*math.cos(a),y+r1*math.sin(a),z+z1),(x+r1*math.cos(b),y+r1*math.sin(b),z+z1),(x+r2*math.cos(b),y+r2*math.sin(b),z+z2),(x+r2*math.cos(a),y+r2*math.sin(a),z+z2)]
            face(group,mat,*pts[:3]);face(group,mat,pts[0],pts[2],pts[3])

def conduit(group,mat,points,r=.045):
    # Sweep an eight-sided section along an authored service/actuator path.
    for a,b in zip(points,points[1:]):
        direction=[b[i]-a[i] for i in range(3)];length=math.sqrt(sum(t*t for t in direction));u=[t/length for t in direction]
        ref=[0,1,0] if abs(u[1])<.9 else [1,0,0]
        v=[u[1]*ref[2]-u[2]*ref[1],u[2]*ref[0]-u[0]*ref[2],u[0]*ref[1]-u[1]*ref[0]];vl=math.sqrt(sum(t*t for t in v));v=[t/vl for t in v]
        w=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        loops=[[(p[j]+r*(math.cos(i*math.tau/8)*v[j]+math.sin(i*math.tau/8)*w[j])) for j in range(3)] for p in [a,b] for i in range(8)]
        for i in range(8):
            j=(i+1)%8;face(group,mat,loops[i],loops[j],loops[8+j]);face(group,mat,loops[i],loops[8+j],loops[8+i])

# Central hull: staggered longitudinal armor, structural spine, recessed core.
armor('body',0,[(-.82,-1.65),(.82,-1.65),(1.12,-.85),(.98,1.42),(.53,1.94),(-.53,1.94),(-.98,1.42),(-1.12,-.85)],-.25,.88)
# Four inset bay liners leave the central core aperture physically open.
for side in [-1,1]: plate('body',2,side*.81,.45,.16,2.1,.35,.22)
for yy in [-.57,1.46]: plate('body',2,0,yy,1.55,.15,.35,.22)
for side in [-1,1]:
    armor('body',1,[(side*.78,-1.3),(side*1.18,-.78),(side*1.05,1.2),(side*.77,1.65),(side*.57,1.35),(side*.63,-.8)],.18,.38)
    conduit('body',1,[(side*.78,-1.3,.42),(side*1.25,-.9,.2),(side*1.34,.8,.12),(side*.85,1.5,.25)],.075)
    for i in range(7): plate('body',2,side*.83,-.65+i*.13,.27,.065,.5,.08,.015)
    for y in [-1.02,1.37]:
        turned('body',1,(side*.77,y,.43),[(.09,0),(.09,.065),(.045,.08),(.045,0)],16)
        turned('body',2,(side*.77,y,.50),[(.035,0),(.035,.02),(.01,.02),(.01,0)],12)
# Core retaining bezel with discrete armored teeth and deeply inset luminous cells.
turned('body',0,(0,.46,.40),[(.72,-.15),(.86,-.10),(.91,.04),(.86,.22),(.69,.25),(.63,.12)],64)
turned('body',1,(0,.46,.41),[(.69,.12),(.7,.18),(.64,.20),(.63,.12)],64)
turned('body',2,(0,.46,.41),[(.62,-.16),(.62,.11),(.53,.08),(.53,-.16)],64)
plate('body',1,0,.46,.70,.84,.36,.12,.15)
plate('body',2,0,.46,.51,.66,.43,.08,.10)
for x in [-.13,0,.13]:
    plate('core',4,x,.46,.046,.35,.5,.035,.008)
    plate('core',4,x,.69,.045,.026,.5,.035,.004)
for i in range(12):
    a=i*math.tau/12
    x,y=.78*math.cos(a),.46+.78*math.sin(a)
    plate('body',3,x,y,.18,.24,.69,.13,.035)
    x,y=.43*math.cos(a),.46+.43*math.sin(a)
    plate('core',4,x,y,.048,.105,.5,.04,.01)
# Lower service chassis, split armored fins and grille.
plate('body',0,0,-1.4,1.1,.48,.22,.35)
for i in range(13): plate('body',1,(i-6)*.064,-1.38,.022,.23,.43,.04,.004)
for s in [-1,1]:
    armor('lower_armor',3,[(s*.12,-1.18),(s*.61,-1.12),(s*.95,-1.65),(s*.65,-2.13),(s*.18,-1.87)],.44,.24)
    conduit('body',1,[(s*.3,-1.4,-.2),(s*.62,-2.03,-.1)],.09)
    plate('body',6,s*.38,-1.93,.08,.11,.60,.035,.01)
# Crown: three overlapping plates, louvres and inset digital light.
armor('top_armor',3,[(-.75,1.23),(.75,1.23),(.92,1.82),(.48,2.12),(-.48,2.12),(-.92,1.82)],.34,.30)
plate('top_armor',0,0,1.74,1.2,.44,.55,.16)
for i in range(11): plate('top_armor',2,(i-5)*.095,1.72,.034,.25,.66,.05,.005)
plate('top_armor',5,0,1.44,.68,.038,.67,.028,.004)
# Twin articulated infrastructure sleds, not humanoid limbs.
for s,group in [(-1,'left_sled'),(1,'right_sled')]:
    conduit('body',1,[(s*.92,.85,-.17),(s*1.65,1.04,-.1)],.13)
    conduit('body',2,[(s*.9,-.6,.0),(s*1.46,-.2,.35),(s*1.68,.68,.12)],.065)
    armor(group,0,[(s*1.15,-.35),(s*1.87,-.56),(s*2.23,.0),(s*2.1,1.44),(s*1.57,1.8),(s*1.21,1.40)],-.10,.72)
    armor(group,3,[(s*1.40,.08),(s*2.16,.22),(s*2.23,1.18),(s*1.76,1.58),(s*1.33,1.34)],.39,.25)
    armor(group,1,[(s*1.47,-.42),(s*1.99,-.25),(s*2.14,.15),(s*1.86,.19),(s*1.51,.03)],.40,.16)
    for i in range(8): plate(group,2,s*1.77,.34+i*.1,.48,.044,.55,.035,.008)
    plate(group,4,s*1.78,1.23,.41,.035,.56,.03,.005)
    turned(group,1,(s*1.40,.80,.38),[(.17,-.04),(.17,.10),(.11,.12),(.11,-.04)],24)
    turned(group,2,(s*1.40,.80,.49),[(.09,0),(.09,.025),(.025,.025),(.025,0)],16)
    for i in range(4):
        y=.18+i*.23
        conduit(group,1,[(s*1.23,y,-.45),(s*1.33,y+.10,-.68),(s*1.88,y+.12,-.67)],.042)
    for i in range(3):
        conduit(group,0,[(s*1.04,-.3+i*.15,.02),(s*1.2,-.53+i*.14,.3),(s*1.4,-.43+i*.14,.36)],.035)
# Authored seams, fasteners and external coolant conduits.
for s,group in [(-1,'left_sled'),(1,'right_sled')]:
    for x,y in [(1.52,1.38),(2.04,1.05),(2.04,.29),(1.62,-.25)]:
        turned(group,1,(s*x,y,.58),[(.052,0),(.052,.034),(.027,.045),(.027,0)],12)
        plate(group,2,s*x,y,.027,.007,.628,.012,.001)
    for i in range(4):
        x=s*(2.05+i*.035)
        conduit(group,2,[(x,.15,-.35),(x+s*.16,-.10,-.30),(x+s*.16,-.45,.0),(x,-.6,.25)],.018)
    armor(group,1,[(s*1.54,1.59),(s*1.92,1.35),(s*2.14,1.29),(s*1.92,1.64),(s*1.64,1.83)],.07,.08,.025)
    for i in range(5): plate(group,1,s*2.18,.36+i*.12,.10,.025,.35,.32,.003)
    conduit(group,0,[(s*1.47,1.36,.60),(s*1.93,1.14,.61),(s*2.1,1.03,.59)],.014)
for side in [-1,1]:
    for y in [-.8,-.5,-.2,.1,1.17]:
        turned('body',1,(side*.98,y,.47),[(.042,0),(.042,.03),(.02,.036),(.02,0)],12)
    conduit('body',2,[(side*.7,1.52,-.25),(side*.88,1.95,-.5),(side*1.18,1.93,-.56),(side*1.38,1.45,-.5)],.055)
    conduit('body',1,[(side*.60,-.86,.39),(side*.58,-.3,.46)],.029)
# More physical detail: rear power rack, stacked cooling fins and service fasteners.
for i in range(15): plate('body',1,0,-.55+i*.115,1.30,.036,-.75,.35,.007)
for x in [-.53,.53]:
    conduit('body',0,[(x,-1.13,-.73),(x,1.05,-.77)],.1)
for x in [-.45,0,.45]:
    plate('body',3,x,-1.08,.28,.26,.51,.12,.03)
    plate('body',5,x,-1.06,.09,.025,.58,.025,.004)

# GLB serialization: one primitive/material per assembly, flat authored normals.
bin_data=bytearray();views=[];accessors=[];meshes=[];nodes=[];groups={}
def accessor(values,fmt,kind,component,minmax=False):
    while len(bin_data)%4:bin_data.append(0)
    offset=len(bin_data);flat=[v for row in values for v in row] if isinstance(values[0],(list,tuple)) else values
    # Quantized VEC3 normals require 4-byte vertex alignment: SHORT3 + padding.
    normal_stride = component == 5122 and kind == 'VEC3'
    if normal_stride: flat=[v for row in values for v in (*row,0)]
    data=struct.pack('<'+fmt*len(flat),*flat);bin_data.extend(data)
    vi=len(views);view={'buffer':0,'byteOffset':offset,'byteLength':len(data),'target':34963 if kind=='SCALAR' else 34962}
    if normal_stride: view['byteStride']=8
    views.append(view)
    a={'bufferView':vi,'componentType':component,'count':len(values),'type':kind}
    if minmax:a.update(min=[min(row[i] for row in values) for i in range(3)],max=[max(row[i] for row in values) for i in range(3)])
    accessors.append(a);return len(accessors)-1
triangle_count=0
for (group,mat),verts in batches.items():
    if group not in groups:
        groups[group]=len(nodes);nodes.append({'name':group,'children':[]})
    positions=[];normals=[];indices=[];unique={}
    for p,n in verts:
        qp=tuple(round(v,6) for v in p);qn=tuple(round(v*32767) for v in n);key=(qp,qn)
        if key not in unique:
            unique[key]=len(positions);positions.append(qp);normals.append(qn)
        indices.append(unique[key])
    pa=accessor(positions,'f','VEC3',5126,True);na=accessor(normals,'h','VEC3',5122);accessors[na]['normalized']=True
    ia=accessor(indices,'H','SCALAR',5123)
    meshes.append({'name':group+'_'+materials[mat][0],'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':mat}]})
    ni=len(nodes);nodes.append({'mesh':len(meshes)-1,'name':group+'_'+materials[mat][0]});nodes[groups[group]]['children'].append(ni)
    triangle_count+=len(verts)//3
mats=[]
for name,color,metal,rough in materials:
    m={'name':name,'pbrMetallicRoughness':{'baseColorFactor':color,'metallicFactor':metal,'roughnessFactor':rough}}
    if name in ['Coolant light','Data indicator','Amber practical']:m['emissiveFactor']={'Coolant light':[.035,.32,.44],'Data indicator':[.02,.17,.06],'Amber practical':[.2,.105,.025]}[name]
    mats.append(m)
gltf={'asset':{'version':'2.0','generator':'Original Guardian polygon/lathe/sweep authoring tool','copyright':'Copyright 2026 Abhi Ram Kotari. Original portfolio artwork.'},'extensionsUsed':['KHR_mesh_quantization'],'extensionsRequired':['KHR_mesh_quantization'],'scene':0,'scenes':[{'nodes':list(groups.values())}],'nodes':nodes,'meshes':meshes,'materials':mats,'buffers':[{'byteLength':len(bin_data)}],'bufferViews':views,'accessors':accessors}
j=json.dumps(gltf,separators=(',',':')).encode();j+=b' '*((-len(j))%4);bin_data+=b'\x00'*((-len(bin_data))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(bin_data))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(bin_data),0x004e4942)+bin_data
path=ROOT/'public/models/cloud-infrastructure-guardian.glb';path.write_bytes(glb)
print(json.dumps({'bytes':len(glb),'triangles':triangle_count,'material_batches':len(meshes),'textures':0,'assemblies':list(groups)},indent=2))
