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

# Open load-bearing spine. No closed rectangular cabinet shell.
armor('body',0,[(-.45,-1.72),(.45,-1.72),(.73,-.80),(.68,1.45),(.28,1.90),(-.28,1.90),(-.68,1.45),(-.73,-.80)],-.55,.62)
for side in [-1,1]:
    conduit('body',1,[(side*.42,-1.60,-.2),(side*.83,-.75,-.4),(side*.95,.55,-.5),(side*.52,1.65,-.35)],.09)
    for i in range(9): plate('body',2,side*.52,-1.15+i*.13,.24,.045,-.13,.09,.008)
    for y in [-1.4,1.6]: turned('body',1,(side*.4,y,-.05),[(.105,0),(.105,.09),(.05,.12),(.05,0)],24)
    conduit('body',2,[(side*.45,-1.1,-.65),(side*.9,-.6,-.95),(side*.9,1.1,-.9),(side*.4,1.8,-.65)],.065)
    plate('body',5,side*.5,-1.2,.08,.027,.08,.04,.005)
# A deep physical core chamber: stepped walls, retainers and exposed turbine fins.
turned('body',0,(0,.45,.10),[(1.05,-.35),(1.25,-.20),(1.28,.10),(1.19,.28),(1.08,.34),(.98,.20),(.95,-.30)],96)
turned('body',1,(0,.45,.11),[(1.09,.16),(1.12,.22),(1.10,.34),(1.04,.36),(1.02,.25)],96)
turned('body',2,(0,.45,.15),[(.99,-.22),(.99,.22),(.84,.10),(.80,-.24)],80)
turned('core',1,(0,.45,.06),[(.77,-.15),(.83,-.03),(.78,.15),(.69,.21),(.64,.09)],80)
turned('core',4,(0,.45,.06),[(.69,.095),(.70,.125),(.66,.16),(.64,.12)],80)
turned('core',0,(0,.45,.06),[(.29,-.12),(.34,.03),(.28,.26),(.12,.33),(.11,-.12)],64)
for i in range(12):
    a=i*math.tau/12
    x,y=.54*math.cos(a),.45+.54*math.sin(a)
    # Separate radial turbine/compute cartridges at different depths.
    plate('core',1,x,y,.12,.19,.13+(i%3)*.028,.12,.025)
    conduit('core',0,[(.33*math.cos(a),.45+.33*math.sin(a),.19),(.68*math.cos(a+.12),.45+.68*math.sin(a+.12),.12)],.035)
    plate('core',4,.58*math.cos(a),.45+.58*math.sin(a),.022,.066,.22,.025,.003)
    x,y=1.14*math.cos(a),.45+1.14*math.sin(a)
    plate('body',3,x,y,.13,.21,.53,.20,.035)
    turned('body',1,(x,y,.64),[(.055,0),(.055,.035),(.024,.045),(.024,0)],16)
# Split protective cheeks part away from the core instead of presenting a UI face.
for side,group in [(-1,'left_housing'),(1,'right_housing')]:
    armor(group,0,[(side*.78,-.45),(side*1.32,-.22),(side*1.45,.8),(side*1.13,1.42),(side*.91,1.30),(side*1.12,.65),(side*.97,.05)],.28,.29)
    conduit(group,3,[(side*1.21,-.19,.45),(side*1.35,.50,.46),(side*1.05,1.29,.42)],.055)
# Raised crown is an open gantry, not a flat cabinet lid.
for side in [-1,1]:
    conduit('top_armor',0,[(side*.48,1.48,-.40),(side*.80,2.10,-.33),(side*.61,2.50,-.23)],.12)
    armor('top_armor',3,[(side*.18,2.2),(side*.67,2.5),(side*1.17,2.19),(side*.88,1.93),(side*.52,2.06)],-.09,.31)
    for i in range(4):plate('top_armor',0,side*(.55+i*.10),2.2-i*.045,.045,.16,.12,.065,.006)
plate('top_armor',5,0,2.30,.25,.025,.11,.05,.005)
conduit('top_armor',0,[(-.62,2.50,-.26),(0,2.67,-.28),(.62,2.50,-.26)],.08)
# Broad lower support cradle with triangular negative spaces and floor skids.
for side in [-1,1]:
    group = "left_support" if side < 0 else "right_support"
    conduit(group,0,[(side*.30,-1.1,-.3),(side*1.34,-1.83,-.42),(side*2.2,-2.03,-.08)],.16)
    conduit(group,1,[(side*.30,-1.1,-.1),(side*.60,-1.95,.38),(side*2.2,-2.03,-.08)],.055)
    armor(group,0,[(side*1.18,-1.89),(side*2.4,-2.13),(side*2.52,-2.3),(side*1.87,-2.27),(side*1.03,-2.02)],-.08,.52)
    turned(group,1,(side*1.24,-1.82,-.05),[(.13,-.02),(.13,.10),(.07,.12),(.07,-.02)],32)
    plate('body',6,side*.28,-1.45,.055,.032,.05,.04,.005)
# Articulated side infrastructure arms. The gaps around core and trusses are real.
for side,group,brace in [(-1,'left_sled','left_brace'),(1,'right_sled','right_brace')]:
    conduit(brace,0,[(side*.88,.85,-.44),(side*1.55,1.36,-.55),(side*2.37,1.18,-.40)],.14)
    conduit(brace,1,[(side*.91,.70,-.27),(side*1.58,.96,-.31),(side*2.37,1.18,-.25)],.055)
    conduit(brace,0,[(side*.90,-.12,-.56),(side*1.58,.22,-.7),(side*2.4,.6,-.52)],.07)
    for x,y in [(1.0,.82),(1.56,1.20),(2.38,1.12)]:
        turned(brace,1,(side*x,y,-.17),[(.16,-.12),(.18,-.03),(.16,.13),(.08,.15),(.08,-.12)],32)
    # Open, canted outer frame with a raised armored blade and hanging service pod.
    conduit(group,0,[(side*2.32,.10,-.15),(side*2.65,1.48,-.40),(side*3.30,1.90,-.31),(side*3.63,1.04,.02),(side*3.41,-.24,.17)],.13)
    conduit(group,1,[(side*2.52,.08,.06),(side*2.82,1.30,-.04),(side*3.21,1.60,.03)],.045)
    armor(group,3,[(side*2.52,1.48),(side*3.14,1.91),(side*3.65,1.28),(side*3.42,.91),(side*2.96,1.18)],.14,.33)
    armor(group,0,[(side*2.7,.35),(side*3.25,.65),(side*3.5,.22),(side*3.28,-.55),(side*2.84,-.42)],.26,.44)
    plate(group,2,side*3.10,.12,.31,.62,.50,.07,.04)
    for i in range(7):plate(group,1,side*3.09,-.13+i*.075,.30,.024,.55,.045,.004)
    conduit(group,0,[(side*2.54,1.19,-.07),(side*2.82,.27,.13)],.10)
    conduit(group,1,[(side*2.59,.98,.05),(side*2.78,.34,.23)],.042)
    turned(group,1,(side*2.57,1.2,.09),[(.17,-.07),(.19,0),(.16,.15),(.09,.18),(.09,-.07)],48)
    for x,y in [(2.91,1.53),(3.47,1.13),(2.88,-.33),(3.32,.3)]:
        turned(group,1,(side*x,y,.51),[(.047,0),(.047,.04),(.020,.05),(.020,0)],20)
    plate(group,4,side*3.13,1.34,.33,.028,.36,.038,.005)
    for i in range(3):
        conduit(group,2,[(side*(2.38+i*.065),.15,-.4),(side*(2.42+i*.06),-.4,-.2),(side*(2.96+i*.025),-.68,.10),(side*3.16,-.43,.23)],.026)
# Rear heat-exchange stack remains exposed around the slim spine.
for i in range(12):plate('body',1,0,-.72+i*.15,.70,.035,-.87,.30,.005)

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
