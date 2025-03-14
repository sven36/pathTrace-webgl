import ShaderBase from "./shaderBase";

const vertexShader = `attribute vec3 v3Pos;

varying vec2 vPosition;//位置
void main(void){
    vec4 vt0= vec4(v3Pos, 1.0);
    vPosition = vec2(v3Pos.x,v3Pos.y);
    gl_Position = vt0;
}
`;

const fragmentShader0 = `precision highp float;

uniform vec3 camPos;
uniform vec3 camUvw[3];
uniform vec3 dof;

uniform float weight;
uniform float time;
uniform vec2 ran;
uniform vec2 area;
uniform float sd[400];
uniform float ld[60];
uniform sampler2D baseTexture;
uniform sampler2D hdrTexture;
uniform sampler2D dataTexture;

varying vec2 vPosition;//位置

#define saturate(x) clamp(x, 0.0, 1.0)
#define SIZE 512.0
#define DATASIZE 512.0
#define PI         3.14159265359
#define invPI     0.3183098861837697
#define invTWO_PI     0.15915494309
#define BOUND 5
#define MAX_LOOP 30

struct Ray {
    vec3 o;
    vec3 d;
    float t;
    bool isHit;
    vec3 pos;
    vec3 normal;
    int mID;
    vec4 emissive;
    vec2 uv;
};
struct Material{
    vec3 baseColor;
    float roughness;
    float specular;
    float metallic;
    float glass;
};
struct Ary2V3d{
    vec3 v0;
    vec3 v1;
};

struct Node{
    int left;
    int right;
    int leaf;
    vec3 aa;
    vec3 bb;
};

struct Tri{
    vec3 v0;
    vec3 v1;
    vec3 v2;
};

struct Gemo{
    vec3 tm;
    vec3 v0;
    vec3 v1;
    vec3 v2;
};

struct BrdfPdf{
    vec3 color;
    float pdf;
};

vec2 seed;
float rand(){
    seed -= vec2(ran.x * ran.y);
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getuv(vec3 p){
    float theta = acos(p.y);
    float phi = atan(p.z, p.x);
    if (phi < 0.0) {
        phi += 2.0 * PI;
    }
    vec2 s;
    s.x = 1.0 - phi * invTWO_PI;
    s.y = theta * invPI;
    return s;
}
vec3 TangentToWorld(vec3 Vec, vec3 TangentZ){
    vec3 UpVector = vec3(1.0, 0.0, 0.0);
    if (abs(TangentZ.z) < 0.999){
        UpVector = vec3(0.0, 0.0, 1.0);
    }
    vec3 TangentX = cross(UpVector,TangentZ);
    TangentX = normalize(TangentX);
    vec3 TangentY = cross(TangentZ,TangentX);
    return TangentX*(Vec.x) + TangentY*(Vec.y) + TangentZ*(Vec.z);
}

vec3 getHdr(vec4 src)
{
    vec3 outc = vec3(1.0,1.0,1.0);
    float e = src.w * 255.0 - 128.0;
    e = pow(2.0,e);
    outc.x = src.x * e;
    outc.y = src.y * e;
    outc.z = src.z * e;
    return outc;
}

vec3 getDir(){
    float f = dof.z;
    float d = 500.0;
    vec2 p = vec2(vPosition.x*SIZE + ran.x - 0.5,vPosition.y*SIZE + ran.y - 0.5) * 0.5;
    p = p * f / d;
    //vec3 dir = camU * p.x + camV * p.y - camW * d;
    //vec3 dir = camU * (p.x-dof.x) + camV * (p.y-dof.y) - camW * f;
    vec3 dir = camUvw[0] * (p.x-dof.x) + camUvw[1] * (p.y-dof.y) - camUvw[2] * f;
    

    dir = normalize(dir);
    return dir;
}


vec3 getBoxNormal(int face_hit){
    if (face_hit == 0) 
        return (vec3(-1.0, 0.0, 0.0));    // -x face
    else if (face_hit == 1) 
        return (vec3(0.0, -1.0, 0.0));    // -y face
    else if (face_hit == 2)
        return (vec3(0.0, 0.0, -1.0));    // -z face
    else if (face_hit == 3)
        return (vec3(1.0, 0.0, 0.0));    // +x face
    else if (face_hit == 4)
        return (vec3(0.0, 1.0, 0.0));    // +y face
    else if (face_hit == 5)
        return (vec3(0.0, 0.0, 1.0));    // +z face
    else
        return vec3(0.0, 0.0, 0.0);
}

bool hitNode(Ray ray, Node node){
    vec3 aa = node.aa;
    vec3 bb = node.bb - node.aa;

    float x0 = aa.x; float x1 = aa.x + bb.x; float y0 = aa.y; float y1 = aa.y + bb.y; float z0=aa.z; float z1 = aa.z + bb.z;
    float ox = ray.o.x; float oy = ray.o.y; float oz = ray.o.z;
    float dx = ray.d.x; float dy = ray.d.y; float dz = ray.d.z;

    float tx_min, ty_min, tz_min;
    float tx_max, ty_max, tz_max;

    float a = 1.0 / dx;
    if (a >= 0.0) {
        tx_min = (x0 - ox) * a;
        tx_max = (x1 - ox) * a;
    }else {
        tx_min = (x1 - ox) * a;
        tx_max = (x0 - ox) * a;
    }

    float b = 1.0 / dy;
    if (b >= 0.0) {
        ty_min = (y0 - oy) * b;
        ty_max = (y1 - oy) * b;
    }else {
        ty_min = (y1 - oy) * b;
        ty_max = (y0 - oy) * b;
    }

    float c = 1.0 / dz;
    if (c >= 0.0) {
        tz_min = (z0 - oz) * c;
        tz_max = (z1 - oz) * c;
    }else {
        tz_min = (z1 - oz) * c;
        tz_max = (z0 - oz) * c;
    }

    float t0, t1;

    int face_in, face_out;


    if (tx_min > ty_min) {
        t0 = tx_min;
        face_in = (a >= 0.0) ? 0 : 3;
    }else {
        t0 = ty_min;
        face_in = (b >= 0.0) ? 1 : 4;
    }

    if (tz_min > t0) {
        t0 = tz_min;
        face_in = (c >= 0.0) ? 2 : 5;
    }

    // find smallest exiting t value
    if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = (a >= 0.0) ? 3 : 0;
    }else {
        t1 = ty_max;
        face_out = (b >= 0.0) ? 4 : 1;
    }

    if (tz_max < t1) {
        t1 = tz_max;
        face_out = (c >= 0.0) ? 5 : 2;
    }

    if (t0 < t1 && t1 > 0.0) {  // condition for a hit
        if (t0 > 0.0) {
            if(t0 < ray.t ){
                return true;
            }
        } else {
            if(t0 < ray.t ){
                return true;
            }
        }
    }
    return false;

}

void intersectBox(inout Ray ray, vec3 aa,vec3 bb,int mID){
    float x0 = aa.x; float x1 = aa.x + bb.x; float y0 = aa.y; float y1 = aa.y + bb.y; float z0=aa.z; float z1 = aa.z + bb.z;
    float ox = ray.o.x; float oy = ray.o.y; float oz = ray.o.z;
    float dx = ray.d.x; float dy = ray.d.y; float dz = ray.d.z;

    float tx_min, ty_min, tz_min;
    float tx_max, ty_max, tz_max;

    float a = 1.0 / dx;
    if (a >= 0.0) {
        tx_min = (x0 - ox) * a;
        tx_max = (x1 - ox) * a;
    }else {
        tx_min = (x1 - ox) * a;
        tx_max = (x0 - ox) * a;
    }

    float b = 1.0 / dy;
    if (b >= 0.0) {
        ty_min = (y0 - oy) * b;
        ty_max = (y1 - oy) * b;
    }else {
        ty_min = (y1 - oy) * b;
        ty_max = (y0 - oy) * b;
    }

    float c = 1.0 / dz;
    if (c >= 0.0) {
        tz_min = (z0 - oz) * c;
        tz_max = (z1 - oz) * c;
    }else {
        tz_min = (z1 - oz) * c;
        tz_max = (z0 - oz) * c;
    }

    float t0, t1;

    int face_in, face_out;


    if (tx_min > ty_min) {
        t0 = tx_min;
        face_in = (a >= 0.0) ? 0 : 3;
    }else {
        t0 = ty_min;
        face_in = (b >= 0.0) ? 1 : 4;
    }

    if (tz_min > t0) {
        t0 = tz_min;
        face_in = (c >= 0.0) ? 2 : 5;
    }

    // find smallest exiting t value
    if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = (a >= 0.0) ? 3 : 0;
    }else {
        t1 = ty_max;
        face_out = (b >= 0.0) ? 4 : 1;
    }

    if (tz_max < t1) {
        t1 = tz_max;
        face_out = (c >= 0.0) ? 5 : 2;
    }

    if (t0 < t1 && t1 > 0.0) {  // condition for a hit
        if (t0 > 0.0) {
            if(t0 < ray.t ){
                ray.isHit = true;
                ray.t = t0;
                ray.pos = ray.o + ray.d * t0;
                ray.normal = getBoxNormal(face_in);
                ray.mID = mID;
            }
        } else {
            if(t0 < ray.t ){
                ray.isHit = true;
                ray.t = t1;
                ray.pos = ray.o + ray.d * t1;
                ray.normal = getBoxNormal(face_out);
                ray.mID = mID;
            }
        }
    }

}


bool intersectSphere(inout Ray ray, vec3 sphereCenter, float sphereRadius,int mID) {
    vec3 toSphere = ray.o - sphereCenter;
    float a = dot(ray.d, ray.d);
    float b = 2.0 * dot(toSphere, ray.d);
    float c = dot(toSphere, toSphere) - sphereRadius*sphereRadius;
    float discriminant = b*b - 4.0*a*c;

    if(discriminant > 0.0) {
        float t = (-b - sqrt(discriminant)) / (2.0 * a);
        if(t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(ray.pos - sphereCenter);
            ray.mID = mID;
            ray.uv = getuv(ray.normal);

            return true;
        }
    }
    return false;
}

void intersectPlane(inout Ray ray,vec3 a,vec3 n,float size,int mID){
    if(dot(ray.d,n) > 0.0){
        return;
    }
    float t = dot(a - ray.o,n) / dot(ray.d,n);
    if (t > 0.0 && t < ray.t) {
        vec3 pos = ray.o + ray.d * t;
        if(abs(pos.x - a.x) > size || abs(pos.y - a.y) > size || abs(pos.z - a.z) > size ){
            return;
        }

        ray.isHit = true;
        ray.t = t;
        ray.normal = n;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        ray.uv = vec2(1.0-(pos.x - a.x)/size,(pos.z - a.z)/size)*2.0;
    }
}
bool intersectRectangle3D(inout Ray ray,vec3 p0,vec3 a, vec3 b, int mID){
    vec3 normal = normalize(cross(a,b));
    float t = dot((p0 - ray.o),normal) / dot(ray.d,normal);

    if (t <= 0.0001)
        return false;

    vec3 p = ray.o + t * ray.d;
    vec3 d = p - p0;

    float ddota = dot(d,a);

    float a_len_squared = dot(a,a);
    float b_len_squared = dot(b,b);

    if (ddota < 0.0 || ddota > a_len_squared)
        return false;

    float ddotb = dot(d,b);

    if (ddotb < 0.0 || ddotb > b_len_squared)
        return false;

    if (t > 0.0 && t < ray.t) {
        ray.isHit = true;
        ray.t = t;
        ray.normal = normal;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        
        vec3 n = cross( b, a );
        vec3 q = cross( ray.d, p0-ray.o );
        
        float i = 1.0/ dot(ray.d,n);
        
        float u = dot( q, a )*i;
        float v = dot( q, b )*i;

        ray.uv = vec2(u,v);

        return true;
    }
    return false;
}

mat4 rotationAxisAngle( vec3 v, float angle ){
    float s = sin( angle );
    float c = cos( angle );
    float ic = 1.0 - c;

    return mat4( v.x*v.x*ic + c,     v.y*v.x*ic - s*v.z, v.z*v.x*ic + s*v.y, 0.0,
                 v.x*v.y*ic + s*v.z, v.y*v.y*ic + c,     v.z*v.y*ic - s*v.x, 0.0,
                 v.x*v.z*ic - s*v.y, v.y*v.z*ic + s*v.x, v.z*v.z*ic + c,     0.0,
                 0.0,                0.0,                0.0,                1.0 );
}

mat4 translate( float x, float y, float z ){
    return mat4( 1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 x,   y,   z,   1.0 );
}
mat4 inverse( in mat4 m ){
    return mat4(
        m[0][0], m[1][0], m[2][0], 0.0,
        m[0][1], m[1][1], m[2][1], 0.0,
        m[0][2], m[1][2], m[2][2], 0.0,
        -dot(m[0].xyz,m[3].xyz),
        -dot(m[1].xyz,m[3].xyz),
        -dot(m[2].xyz,m[3].xyz),
        1.0 );
}
/*射线，大小，旋转，位置*/
void intersectObb(inout Ray ray,vec3 rad,vec4 rotation,vec3 pos,int mID) {
    
    mat4 rot = rotationAxisAngle( normalize(rotation.xyz), rotation.w );
    mat4 tra = translate( pos.x, pos.y, pos.z );
    mat4 txi = tra * rot; 
    mat4 txx = inverse( txi );

    // convert from ray to box space
    vec3 rdd = (txx*vec4(ray.d,0.0)).xyz;
    vec3 roo = (txx*vec4(ray.o,1.0)).xyz;

    // ray-box intersection in box space
    vec3 m = 1.0/rdd;
    vec3 n = m*roo;
    vec3 k = abs(m)*rad;
    
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    
    if( tN > tF || tF < 0.0) 
        return;
    

    vec3 nor = -sign(rdd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);

    if(tN <= 0.0){
        return;
    }
    // convert to ray space
    nor = (txi * vec4(nor,0.0)).xyz;

    

    if (tN < ray.t) {
        ray.isHit = true;
        ray.t = tN;
        ray.normal = nor;
        ray.pos = ray.o + ray.d * tN;
        ray.mID = mID;

        vec3 opos = (txx*vec4(ray.pos,1.0)).xyz;
		vec3 onor = (txx*vec4(nor,0.0)).xyz;

        if(abs(onor.x) > 0.1){
            ray.uv = 0.025*opos.yz + 0.5;
        }else if(abs(onor.y) > 0.1){
            ray.uv = 0.025*opos.zx + 0.5;
        }else if(abs(onor.z) > 0.1){
            ray.uv = 0.025*opos.xy + 0.5;
        }
    }
}

void intersectCylinder(inout Ray ray, vec3 pa, vec3 pb, float ra ,int mID){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 
    vec3 ba = pb-pa;

    vec3  oc = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoc = dot(ba,oc);
    
    float k2 = baba            - bard*bard;
    float k1 = baba*dot(oc,rd) - baoc*bard;
    float k0 = baba*dot(oc,oc) - baoc*baoc - ra*ra*baba;
    
    float h = k1*k1 - k2*k0;

    if( h < 0.0 ) {
        return;
    }

    h = sqrt(h);
    float t = (-k1-h)/k2;

    // body
    
    float y = baoc + t*bard;
    
    if(t > 0.0 && y>0.0 && y<baba && t < ray.t){
        ray.isHit = true;
        ray.t = t;
        ray.normal = (oc+t*rd - ba*y/baba)/ra;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        //ray.uv = getuv(ray.normal);
        ray.uv.x = y / baba;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
        ray.uv.y = acos(dot(base,ray.normal)) / PI;
        return;
    } 
    
    // caps
    t = ( ((y<0.0) ? 0.0 : baba) - baoc)/bard;
    if(t > 0.0 && abs(k1+k2*t)<h && t < ray.t){
        ray.isHit = true;
        ray.t = t;
        ray.normal = normalize(ba*sign(y)/baba);
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),ray.normal);
        if(y > 0.0){
            vec3 pp = (ray.pos-pb)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
        }else{
            vec3 pp = (ray.pos-pa)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
        }
        
    }

}

// compute normal
vec3 capNormal( in vec3 pos, in vec3 a, in vec3 b, in float r )
{
    vec3  ba = b - a;
    vec3  pa = pos - a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return normalize((pa - h*ba)/r);
}

void intersectCap(inout Ray ray, vec3 pa, vec3 pb, float r ,int mID)
{
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3  ba = pb - pa;
    vec3  oa = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoa = dot(ba,oa);
    float rdoa = dot(rd,oa);
    float oaoa = dot(oa,oa);

    float a = baba      - bard*bard;
    float b = baba*rdoa - baoa*bard;
    float c = baba*oaoa - baoa*baoa - r*r*baba;
    float h = b*b - a*c;
    if( h>=0.0 )
    {
        float t = (-b-sqrt(h))/a;

        float y = baoa + t*bard;
        
        // body
        if( y>0.0 && y<baba && t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = capNormal(ray.pos,pa,pb,t);
            ray.mID = mID;
            ray.uv.x = y / baba;
            vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
            ray.uv.y = acos(dot(base,ray.normal)) / PI;
            return;
        } 

        // caps
        vec3 oc = (y<=0.0) ? oa : ro - pb;
        b = dot(rd,oc);
        c = dot(oc,oc) - r*r;
        h = b*b - c;
        t = -b - sqrt(h);
        if( h>0.0 && t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = capNormal(ray.pos,pa,pb,t);
            ray.mID = mID;
            //ray.uv = getuv(TangentToWorld(ray.normal,-normalize(ba)));
            ray.uv = getuv(ray.normal);
        }
    }
}
float dot2( in vec3 v ) { return dot(v,v); }
void intersectCappedCone( inout Ray ray, vec3  pa, vec3  pb, float ra, float rb,int mID ){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3  ba = pb - pa;
    vec3  oa = ro - pa;
    vec3  ob = ro - pb;
    
    float baba = dot(ba,ba);
    float rdba = dot(rd,ba);
    float oaba = dot(oa,ba);
    float obba = dot(ob,ba);
    
    float t = 0.0;
    //caps
    if( oaba<0.0 )
    {
        // example of delayed division
        t = -oaba/rdba;
        if( dot2(oa*rdba-rd*oaba)<(ra*ra*rdba*rdba) && t > 0.0 && t < ray.t )
        {
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(-ba*inversesqrt(baba));
            ray.mID = mID;

            vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),ray.normal);
            vec3 pp = (ray.pos-pa)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
            return;// vec4(-oaba/rdba,-ba*inversesqrt(baba));
        }
    }
    else if( obba>0.0 )
    {
        // example of NOT delayed division
        t =-obba/rdba;
        if( dot2(ob+rd*t)<(rb*rb) && t > 0.0 && t < ray.t)
        {
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(ba*inversesqrt(baba));
            ray.mID = mID;

            
            return;// vec4(t,ba*inversesqrt(baba));
        }
    }
    
    
    // body
    float rr = rb - ra;
    float hy = baba + rr*rr;
    vec3  oc = oa*rb - ob*ra;
    
    float ocba = dot(oc,ba);
    float ocrd = dot(oc,rd);
    float ococ = dot(oc,oc);
    
    float k2 = baba*baba      - hy*rdba*rdba; // the gap is rdrd which is 1.0
    float k1 = baba*baba*ocrd - hy*rdba*ocba;
    float k0 = baba*baba*ococ - hy*ocba*ocba;

    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return;

    t = (-k1-sign(rr)*sqrt(h))/(k2*rr);
    
    float y = oaba + t*rdba;
    if( y>0.0 && y<baba && t > 0.0 && t < ray.t ) 
    {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = normalize(baba*(baba*(oa+t*rd)-rr*ba*ra)-ba*hy*y);
        ray.mID = mID;
        ray.uv.x = y / baba;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
        ray.uv.y = acos(dot(base,ray.normal)) / PI;
        return;
    }
    
}


void hitTri(inout Ray ray,Tri tri,int mID){
    float a = tri.v0.x - tri.v1.x, b = tri.v0.x - tri.v2.x, c = ray.d.x, d = tri.v0.x - ray.o.x;
    float e = tri.v0.y - tri.v1.y, f = tri.v0.y - tri.v2.y, g = ray.d.y, h = tri.v0.y - ray.o.y;
    float i = tri.v0.z - tri.v1.z, j = tri.v0.z - tri.v2.z, k = ray.d.z, l = tri.v0.z - ray.o.z;

    float m = f * k - g * j, n = h * k - g * l, p = f * l - h * j;
    float q = g * i - e * k, s = e * j - f * i;

    float inv_denom = 1.0 / (a * m + b * q + c * s);

    float e1 = d * m - b * n - c * p;
    float beta = e1 * inv_denom;

    if (beta < 0.0){
        return;
    }

    float r = e * l - h * i;
    float e2 = a * n + d * q + c * r;
    float gamma = e2 * inv_denom;

    if (gamma < 0.0){
        return;
    }
    if (beta + gamma > 1.0){
        return;
    }
    float e3 = a * p - b * r + d * s;
    float t = e3 * inv_denom;

    if (t < 0.0001){
        return;
    } 

    if (ray.t > t)
    {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = -normalize(cross( tri.v1-tri.v0, tri.v2-tri.v0 ));
        ray.mID = mID;
    }

}

void intersectTri( inout Ray ray, vec3 v0, vec3 v1, vec3 v2 ,int mID){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3 v1v0 = v1 - v0;
    vec3 v2v0 = v2 - v0;
    vec3 rov0 = ro - v0;

    vec3  n = cross( v1v0, v2v0 );
    vec3  q = cross( rov0, rd );
    float d = 1.0/dot( rd, n );
    float u = d*dot( -q, v2v0 );
    float v = d*dot(  q, v1v0 );
    float t = d*dot( -n, rov0 );


    if( u<0.0 || u>1.0 || v<0.0 || (u+v)>1.0 ) 
        return;

    if(t > 0.0 && t < ray.t ) {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = -normalize(n);
        ray.mID = mID;
    }
    
}




float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}
vec3 cosineWeightedDirection(float seed, vec3 normal) {
    float u = random(vec3(12.9898, 78.233, 151.7182), seed);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed);
    float r = sqrt(u);
    float angle = 6.283185307179586 * v;
    vec3 sdir, tdir;
    if (abs(normal.x)<.5) {
        sdir = cross(normal, vec3(1,0,0));
    }else {
        sdir = cross(normal, vec3(0,1,0));
    }
    tdir = cross(normal, sdir);
    return r*cos(angle)*sdir + r*sin(angle)*tdir + sqrt(1.-u)*normal;
}
vec3 uniformlyRandomDirection(float seed) {
    float u = random(vec3(12.9898, 78.233, 151.7182), seed);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed);
    float z = 1.0 - 2.0 * u;
    float r = sqrt(1.0 - z * z);
    float angle = 6.283185307179586 * v;
    return vec3(r * cos(angle), r * sin(angle), z);
}
vec3 uniformlyRandomVector(float seed) {
    return uniformlyRandomDirection(seed) * sqrt(random(vec3(36.7539, 50.3658, 306.2759), seed));
}


vec3 CosineSampleHemisphere(float u1, float u2){
    vec3 dir;
    float r = sqrt(u1);
    float phi = 2.0 * PI * u2;
    dir.x = r * cos(phi);
    dir.y = r * sin(phi);
    dir.z = sqrt(max(0.0, 1.0 - dir.x*dir.x - dir.y*dir.y));

    return dir;
}


vec3 ImportanceSampleGGX(float Roughness,vec3 N,vec2 E) {

    // float u = random(vec3(12.9898, 78.233, 151.7182), seed.x);
    // float v = random(vec3(63.7264, 10.873, 623.6736), seed.y);
    // vec2 E = vec2(u,v);

    float m = Roughness * Roughness;
    float m2 = m * m;

    float Phi = 2.0 * PI * E.x;
    float CosTheta = sqrt((1.0 - E.y) / (1.0 + (m2 - 1.0) * E.y));
    float SinTheta = sqrt(1.0 - CosTheta * CosTheta);

    vec3 H = vec3(0.0, 0.0, 0.0);
    H.x = SinTheta * cos(Phi);
    H.y = SinTheta * sin(Phi);
    H.z = CosTheta;

    return normalize(TangentToWorld(vec3(H.x, H.y, H.z),N));
}

float SchlickFresnel(float u)
{
    float m = clamp(1.0 - u, 0.0, 1.0);
    float m2 = m * m;
    return m2 * m2*m; // pow(m,5)
}

vec4 GlassDir(vec3 N,float galss,vec3 d){
    vec3 ffnormal = dot(N, d) <= 0.0 ? N : N * -1.0;
    float n1 = 1.0;
    float n2 = galss;
    float R0 = (n1 - n2) / (n1 + n2);
    R0 *= R0;
    float theta = dot(-d, ffnormal);
    float prob =  R0 + (1.0 - R0) * SchlickFresnel(theta);
    vec3 dir;


    float eta = dot(N, ffnormal) > 0.0 ? (n1 / n2) : (n2 / n1);
    vec3 transDir = normalize(refract(d, ffnormal, eta));
    float cos2t = 1.0 - eta * eta * (1.0 - theta * theta);


    if (cos2t < 0.0 || rand() < prob) // Reflection
    {
        dir = normalize(reflect(d, ffnormal));
    }
    else
    {
        dir = transDir;
        //dir = ImportanceSampleGGX(0.3,dir,vec2(rand(),rand()));
    }
    
    return vec4(dir,2.0);
}

vec4 SampleDir(vec3 N,vec3 V, float Roughness,float Metallic,vec2 seed){

    float u = random(vec3(12.9898, 78.233, 151.7182), seed.x);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed.y);
    vec2 E = vec2(u,v);

    vec3 dir;

    float probability = rand();
    float diffuseRatio = 0.5 * (1.0 - Metallic);


    vec3 UpVector = abs(N.z) < 0.999 ? vec3(0, 0, 1) : vec3(1, 0, 0);
    vec3 TangentX = normalize(cross(UpVector, N));
    vec3 TangentY = cross(N, TangentX);

    float type = 0.0;
    if (probability < diffuseRatio){ // sample diffuse
        dir = CosineSampleHemisphere(E.x, E.y);
        dir = TangentX * dir.x + TangentY * dir.y + N * dir.z;
        dir = normalize(dir);
        type = 0.0;
    }else{
        dir = ImportanceSampleGGX(Roughness,V,E);
        type = 1.0;
    }
    return vec4(dir,type);
}


vec3 getData(int i,int j){
    float off = 0.5/256.0;
    return texture2D(dataTexture,vec2(off + float(i)/256.0,off+float(j)/256.0)).xyz;
}
vec3 getDataById(int id){
    float ox = fract(float(id) / DATASIZE);
    float oy = floor(float(id) / DATASIZE)/DATASIZE;
    float off = 0.5/DATASIZE;
    return texture2D(dataTexture,vec2(off + ox,off+oy)).xyz;
}
Node getNodeByID(int id){
    Node node;

    vec3 info = getDataById(200*512 + id*3);
    node.left = int(info.x);
    node.right = int(info.y);
    node.leaf = int(info.z);

    node.aa = getDataById(200*512 + id*3 + 1);
    node.bb = getDataById(200*512 + id*3 + 2);
    
    return node;
}

Tri getTriByID(int id){
    Tri tri;
    tri.v0 = getDataById(300*512 + id*3);
    tri.v1 = getDataById(300*512 + id*3 + 1);
    tri.v2 = getDataById(300*512 + id*3 + 2);
    return tri;
}

int getArrayIdx(inout int stackAry[MAX_LOOP],int idx){
    for(int i = 0;i < MAX_LOOP;i++){
        if(i == idx){
            return stackAry[i];
        }
    }
    return -1;
}

void setArrayIdx(inout int stackAry[MAX_LOOP],int idx,int val){
    for(int i = 0;i < MAX_LOOP;i++){
        if(i == idx){
            stackAry[i] = val;
            return;
        }
    }
    
}


void testKDScene(inout Ray ray){
    int stackAry[MAX_LOOP];
    stackAry[0] = 0;

    int stackPtr = 1;

    for(int i = 0;i < MAX_LOOP;i++){
        if(stackPtr <= 0){
            break;
        }
        stackPtr--;
        Node fn = getNodeByID(getArrayIdx(stackAry,stackPtr));
        //Node fn = getNodeByID(stackAry[stackPtr]);
        if (hitNode(ray,fn)){
            if (fn.left > 0 && fn.right > 0){
                //stackAry[stackPtr] = fn.left;
                setArrayIdx(stackAry,stackPtr,fn.left);
                stackPtr++;
                //stackAry[stackPtr] = fn.right;
                setArrayIdx(stackAry,stackPtr,fn.right);
                stackPtr++;
            }else if (fn.leaf > 0){
                Tri tri = getTriByID(fn.leaf);
                //intersectTri(ray, tri.v0,tri.v1,tri.v2,0);
                hitTri(ray,tri,0);
            }
        }
    }
    
    return;
}
Gemo getGemoByTexture(int mID){
    Gemo m;
    m.tm = getDataById(100*512 + mID*4);
    m.v0 = getDataById(100*512 + mID*4 + 1);
    m.v1 = getDataById(100*512 + mID*4 + 2);
    m.v2 = getDataById(100*512 + mID*4 + 3);
    return m;
}

void testTextureScene(inout Ray ray){
    for(int i=0;i<30;i++){
        Gemo m = getGemoByTexture(i);
        if(int(m.tm.x) == 0){
            intersectSphere(ray, m.v0, m.v1.x,int(m.tm.y));
        }else if(int(m.tm.x) == 1){
            intersectPlane(ray, m.v0, m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 2){
            intersectObb(ray,m.v2,vec4(m.v1,m.tm.z),m.v0,int(m.tm.y));
        }else if(int(m.tm.x) == 3){
            intersectCap(ray,m.v0,m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 4){
            intersectCylinder(ray,m.v0,m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 5){
            intersectCappedCone(ray,m.v0,m.v1,m.v2.x,m.v2.y,int(m.tm.y));
        }else{
            break;
        }
    }
}




void testLightSphere(inout Ray ray,vec3 pos,float lightsize,float intensity,vec3 color){
    if(intersectSphere(ray,pos,lightsize,-1)){
        float t = ray.t;
        float area = 4.0 * PI * lightsize * lightsize;
        float pdf = (t * t) / area;
        ray.emissive = vec4(color*intensity,pdf);
    }

}
void testLightArea(inout Ray ray,vec3 pos,vec3 dirA,vec3 dirB,float intensity,vec3 color){
    //intersectRectangle3D(inout Ray ray,vec3 p0,vec3 a, vec3 b, int mID){
    if(intersectRectangle3D(ray,pos,dirA,dirB,-1)){
        vec3 n = normalize(cross(dirA,dirB));
        float area = length(cross(dirA,dirB));
        float t = ray.t;
        float pdf = 1000000.0;
        if(dot(n,normalize(ray.d)) > 0.0){
            pdf = (t * t) / (area * abs(dot(n,normalize(ray.d))));
        }
        ray.emissive = vec4(color*intensity,pdf);
    }
    
}

void testLight(inout Ray ray){
    testLightSphere(ray,vec3(ld[0],ld[1],ld[2]),ld[3],ld[5],vec3(ld[6],ld[7],ld[8]));
    testLightArea(ray,vec3(ld[9],ld[10],ld[11]),vec3(ld[12],ld[13],ld[14]),vec3(ld[15],ld[16],ld[17]),ld[19],vec3(ld[20],ld[21],ld[22]));
    }

void testBaseScene(inout Ray ray){
    intersectPlane(ray, vec3(sd[0],sd[1],sd[2]), vec3(sd[3],sd[4],sd[5]),sd[6],0);
    intersectSphere(ray,vec3(sd[7],sd[8],sd[9]), sd[10], 3);
    intersectSphere(ray,vec3(sd[11],sd[12],sd[13]), sd[14], 3);
    intersectSphere(ray,vec3(sd[15],sd[16],sd[17]), sd[18], 5);
    intersectSphere(ray,vec3(sd[19],sd[20],sd[21]), sd[22], 8);
    intersectObb(ray,vec3(20.0,20.0,20.0),vec4(1.0,1.0,1.0,0.0),vec3(80.0,20.0,0.0),8);
    intersectCap(ray,vec3(80.0,10.0,-35.0),vec3(80.0,30.0,-35.0),8.0,6);
    intersectCappedCone(ray,vec3(-0.0,0.0,-120.0),vec3(-0.0,60.0,-120.0),20.0,0.0,6);
}


void testScene(inout Ray ray,bool tf){
    testLight(ray);
    testBaseScene(ray);
}

vec3 texUv(vec2 uv,int id){
    
    uv.xy += vec2(20.0,20.0);
    uv = fract(uv);
    uv.xy *= 0.248;
    uv.x += mod(float(id),4.0) * 0.25 + 0.002;
    uv.y += floor(float(id) / 4.0) * 0.25 + 0.002;
    
    vec3 color = pow(texture2D( dataTexture, uv).xyz,vec3(2.2));
    return color;
}

Material getMatrial(int mID,vec2 uv){
    
    if(mID == 0)
        return Material(texUv(uv,3),1.0,0.0,0.0,0.0);
    else if (mID == 1)
        return Material(vec3(0.56,0.57,0.58),0.3,1.0,1.0,0.0);
    else if (mID == 2)
        return Material(vec3(0.91,0.92,0.92),0.3,1.0,1.0,0.0);
    else if (mID == 3)
        return Material(vec3(1.0,1.0,1.0),0.1,1.0,0.0,0.0);
    else if (mID == 4)
        return Material(vec3(0.0,1.0,0.0),0.2,1.0,0.0,0.0);
    else if (mID == 5)
        return Material(vec3(1.0,1.0,1.0),0.1,1.0,1.0,0.0);
    else if (mID == 6)//金
        return Material(vec3(1.0,0.71,0.29),0.3,1.0,1.0,0.0);
    else if (mID == 7)//银
        return Material(vec3(0.95,0.93,0.88),0.3,1.0,1.0,0.0);
    else if (mID == 8)//铜
        return Material(vec3(0.95,0.64,0.54),0.05,1.0,1.0,0.0);
    else if (mID == 10)
        return Material(vec3(1.0,1.0,1.0),1.0,0.0,0.0,1.5);
    else if (mID == 11)
        return Material(texUv(uv,0),1.0,0.0,0.0,0.0);
    else if (mID == 12)
        return Material(texUv(uv,1),1.0,0.0,0.0,0.0);
    else if (mID == 13)
        return Material(texUv(uv,2),1.0,0.0,0.0,0.0);
    else if (mID == 14)
        return Material(texUv(uv,3),1.0,0.0,0.0,0.0);
    else
        return Material(vec3(1.0,1.0,1.0),1.0,0.0,0.0,0.0);
}


bool shadow(vec3 pos,vec3 dir,float t){
    Ray ray;
    ray.d  = dir;
    ray.o = pos + dir * 0.01;
    ray.t = t;
    ray.isHit = false;
    //ray.shadow = true;
    testBaseScene(ray);
    return ray.isHit;

}

float getAttenuation( vec3 lightPosition, vec3 vertexPosition, float lightRadius )
{
    float r                = lightRadius;
    vec3 L                = lightPosition - vertexPosition;
    float dist            = length(L);
    float d                = max( dist - r, 0.0 );
    L                    /= dist;
    float denom            = d / r + 1.0;
    float attenuation    = 1.0 / (denom*denom);
    float cutoff        = 0.0052;
    attenuation            = (attenuation - cutoff) / (1.0 - cutoff);
    attenuation            = max(attenuation, 0.0);
    
    return attenuation;
}



vec3 Diffuse_Lambert( vec3 DiffuseColor )
{
    return DiffuseColor * (1.0 / PI);
}

float D_GGX( float Roughness, float NoH )
{
    float m = Roughness * Roughness;
    float m2 = m * m;
    float d = ( NoH * m2 - NoH ) * NoH + 1.0;    // 2 mad
    return m2 / ( PI*d*d );                    // 4 mul, 1 rcp
}

float Vis_Smith( float Roughness, float NoV, float NoL )
{
    float a = Roughness * Roughness ;
    float a2 = a*a;

    float Vis_SmithV = NoV + sqrt( NoV * (NoV - NoV * a2) + a2 );
    float Vis_SmithL = NoL + sqrt( NoL * (NoL - NoL * a2) + a2 );
    return 1.0 / ( Vis_SmithV * Vis_SmithL );
}

vec3 F_Schlick( vec3 SpecularColor, float VoH )
{
    float Fc = pow( 1.0 - VoH, 5.0 );
    return Fc + (1.0 - Fc) * SpecularColor;
    //return saturate( 50.0 * SpecularColor.y ) * Fc + (1.0 - Fc) * SpecularColor;
}

vec3 brdf(vec3 N,vec3 L,vec3 V,vec3 inColor,Material m){
    
    vec3 uBaseColor = m.baseColor;
    float uRoughness = m.roughness;
    float uSpecular = m.specular;
    float uMetallic = m.metallic;
    N = normalize(N);
    L = normalize(L);
    V = normalize(V);
    //vec3 N                  = normalize( vNormal );
    //vec3 L                  = normalize( uLightPosition - vPosition );
    //vec3 V                  = normalize( uCamPosition - vPosition );
    vec3 H                    = normalize(V + L);
    
    float NoL                = saturate( dot( N, L ) );
    float NoV                = saturate( dot( N, V ) );
    float VoH                = saturate( dot( V, H ) );
    float NoH                = saturate( dot( N, H ) );

    vec3 diffuseColor        = uBaseColor - uBaseColor * uMetallic;
    vec3 specularColor        = mix( vec3( 0.08 * uSpecular ), uBaseColor, uMetallic );

    // Microfacet specular = D*G*F / (4*NoL*NoV) = D*Vis*F
    // Vis = G / (4*NoL*NoV)
    
    float D         = D_GGX(uRoughness,NoH);
    float Vis       = Vis_Smith(uRoughness,NoV,NoL);
    vec3  F         = F_Schlick(specularColor,VoH);

    vec3 diffuse    = Diffuse_Lambert(diffuseColor);
    //vec3 diffuse    = Diffuse_OrenNayar(diffuseColor,uRoughness,NoV, NoL,VoH);
    vec3 specular   = D * Vis * F;
    vec3 color      = inColor * ( diffuse + specular ) * NoL;

    return color;
}

vec3 brdfDiffuse(vec3 N,vec3 L,vec3 V,vec3 inColor,Material m){
    return inColor * invPI * saturate( dot( N, L ) );
}

Ary2V3d calculatePointLight(vec3 pos,vec3 normal,vec3 lightpos,float lightsize,float intensity,vec3 color){
    float lightArea = 4.0 * PI * lightsize * lightsize;
    vec3 pointlight = lightpos+ uniformlyRandomVector(time - 53.0) * lightsize;
    vec3 lightdir = normalize(pointlight - pos);
    float d = length(pointlight - pos);
    Ary2V3d avd;
    avd.v0 = vec3(0.0,0.0,0.0);
    avd.v1 = lightdir;
    if(!shadow(pos,lightdir,d)){

        float pdf =  (d*d) / lightArea;
        avd.v0 = color*intensity / pdf;
    }
    return avd;
}

Ary2V3d areaPointLight(vec3 pos,vec3 normal,vec3 lightpos,vec3 lightdirA,vec3 lightdirB,float intensity,vec3 color){
    float lightArea = length(cross(lightdirA,lightdirB));
    vec3 n = normalize(cross(lightdirA,lightdirB));
    vec3 pointlight = lightpos + lightdirA * area.x + lightdirB * area.y;

    vec3 lightdir = normalize(pointlight - pos);
    float s = saturate(dot(n,lightdir));
    float d = length(pointlight - pos);

    Ary2V3d avd;
    avd.v0 = vec3(0.0,0.0,0.0);
    avd.v1 = lightdir;
    if(!shadow(pos,lightdir,d)){
        float pdf = (d*d) /(lightArea*s) ;
        avd.v0 = color*intensity / pdf;
    }
    return avd;

}

//#directLight
vec3 directLight(vec3 pos,vec3 lastPos,vec3 normal,Material m){
    Ary2V3d avd;
    vec3 color = vec3(0.0,0.0,0.0);
    avd = calculatePointLight(pos,normal,vec3(ld[0],ld[1],ld[2]),ld[3],ld[5],vec3(ld[6],ld[7],ld[8]));
    color += brdf(normal,avd.v1,normalize(lastPos - pos),avd.v0,m);
    avd = areaPointLight(pos,normal,vec3(ld[9],ld[10],ld[11]),vec3(ld[12],ld[13],ld[14]),vec3(ld[15],ld[16],ld[17]),ld[19],vec3(ld[20],ld[21],ld[22]));
    color += brdf(normal,avd.v1,normalize(lastPos - pos),avd.v0,m);
    return color;
    }
//#directLight_end

BrdfPdf brdf3_d(vec3 N,vec3 L,vec3 V,Material m){
    vec3 uBaseColor     = m.baseColor;
    float uMetallic     = m.metallic;
    vec3 diffuseColor   = uBaseColor - uBaseColor * uMetallic;
    N = normalize(N);
    L = normalize(L);
    float NoL   = saturate( dot( N, L ) );

    //#lambert = DiffuseColor * NoL / PI
    //#pdf = NoL / PI
    vec3 color = vec3(0.0,0.0,0.0);
    if(NoL > 0.0){
        color = diffuseColor;
    }

    BrdfPdf bf;
    bf.color = color;
    bf.pdf = NoL / PI;
          
    return bf;
}

BrdfPdf brdf3_s(vec3 N,vec3 L,vec3 V,Material m){
    
    vec3 uBaseColor = m.baseColor;
    float uRoughness = m.roughness;
    float uSpecular = m.specular;
    float uMetallic = m.metallic;
    N = normalize(N);
    L = normalize(L);
    V = normalize(V);
    //vec3 N                  = normalize( vNormal );
    //vec3 L                  = normalize( uLightPosition - vPosition );
    //vec3 V                  = normalize( uCamPosition - vPosition );
    vec3 H                    = normalize(V + L);
    
    float NoL                = saturate( dot( N, L ) );
    float NoV                = saturate( dot( N, V ) );
    float VoH                = saturate( dot( V, H ) );
    float NoH                = saturate( dot( N, H ) );

    //vec3 diffuseColor        = uBaseColor - uBaseColor * uMetallic;
    vec3 specularColor        = mix( vec3( 0.08 * uSpecular ), uBaseColor, uMetallic );

    // Microfacet specular = D*G*F / (4*NoL*NoV) = D*Vis*F
    // Vis = G / (4*NoL*NoV)

    // Microfacet specular = D*G*F / (4*NoL*NoV)
    // pdf = D * NoH / (4 * VoH)
    
    float D         = D_GGX(uRoughness,NoH);
    float Vis       = Vis_Smith(uRoughness,NoV,NoL);
    vec3  F         = F_Schlick(specularColor,VoH);

    vec3 specular   = Vis * F;
    float ss = 4.0 * NoL * VoH /(VoH + 0.001);
    specular *= ss;
    vec3 color      = ( specular ) * NoL;

    BrdfPdf bf;
    bf.color = color;
    bf.pdf = D * NoH / (4.0 * VoH);

    return bf;
}

float powerHeuristic(float a, float b){
    float t = a * a;
    return t / (b*b + t);
}
vec3 EmitterSample(int depth,bool specularBounce,float brdfPdf,float lightPdf,vec3 emission)
{
    vec3 Le;

    if (depth == 0 || specularBounce)
        Le = emission;
    else
        Le = powerHeuristic(brdfPdf, lightPdf) * emission / lightPdf;

    return Le;
}

vec3 calculate(vec3 o,vec3 d,float t){
    Ray ray;
    ray.d  = d;
    ray.o = o;
    ray.t = t;
    ray.isHit = false;
    
    vec3 ac = vec3(0.0,0.0,0.0);
    float sc = 1.0;
    vec3 lastNormal;
    vec3 lastPos = o;
    //Material ms[5];
    //vec3 baseColor;float roughness;float specular;float metallic;
    Material m;

    
    vec3 radiance = vec3(0.0);
    vec3 throughput = vec3(1.0);
    bool specularBounce = true;
    float lastRoughness = 1.0;

    for(int count=0;count<BOUND;count++){
        testScene(ray,count == 0);

        m = getMatrial(ray.mID,ray.uv);

        float r = m.roughness;
        if(count > 0 && lastRoughness > r){
            r = lastRoughness;
        }
        m.roughness = r;

        vec3 color = vec3(0.0,0.0,0.0);
        Ary2V3d avd;
        float brdfPdf;
        if (ray.isHit){

            lastRoughness = m.roughness;
            
            if(ray.mID < 0){
                radiance += EmitterSample(count,specularBounce,brdfPdf,ray.emissive.w,ray.emissive.xyz) * throughput;
                break;
            }
            
            vec4 newd;
            if(m.glass > 0.0){
                specularBounce = true;
                newd = GlassDir(ray.normal,m.glass,ray.d);
                brdfPdf = 1.0;
                throughput *= m.baseColor;
            }else{
                specularBounce = false;
                radiance += directLight(ray.pos,lastPos,ray.normal,m) * throughput;
            
                newd = SampleDir(ray.normal,normalize(reflect(ray.d, ray.normal)),r,m.metallic,vec2(ran.x+float(count),ran.y+float(count)));

                int type = int(newd.w);
                BrdfPdf brdf;
                if(type == 0){
                    brdf = brdf3_d(ray.normal,-ray.d,newd.xyz,m);
                }else if(type == 1){
                    brdf = brdf3_s(ray.normal,-ray.d,newd.xyz,m);
                }
                throughput *= brdf.color;
                brdfPdf = brdf.pdf;

            }
           

            ray.isHit = false;
            ray.d = newd.xyz;
            ray.o = ray.pos + ray.d * 0.05;
            ray.t = 10000000.0;
            //ray.sOrd = int(newd.w);
            ray.mID = 0;
            lastNormal = ray.normal;
            lastPos = ray.pos;
        }else{

            vec3 hdrColor = getHdr(texture2D( hdrTexture, getuv(ray.d)));
            //traces[count].directColor = hdrColor;//vec3(1.2,1.2,1.2) * 50.0;
            //traces[count].pos = ray.o + ray.d * 10000.0;
            //traces[count].sOrd = ray.sOrd;
            radiance += hdrColor * throughput;
            break;
        }
    }
    
    return max(radiance,vec3(0.0,0.0,0.0));
}

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

void main(void){

      vec3 color = calculate(camPos,getDir(),10000000.0);

  vec3 texture = texture2D(baseTexture, gl_FragCoord.xy / 512.0).xyz;
  color = mix(color, texture, weight);
  gl_FragColor = vec4(color, 1.0);

}`;


const pathShader = new ShaderBase(vertexShader, fragmentShader0)

pathShader.initShader = (gl) => {
    const program = pathShader.attachShader(gl);
    gl.bindAttribLocation(program, 0, "v3Pos"),
        gl.bindAttribLocation(program, 1, "v2Uv"),
        gl.bindAttribLocation(program, 2, "v3Nor"),
        gl.bindAttribLocation(program, 3, "v3Tan")
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked || gl.isContextLost()) {
        const err = gl.getProgramInfoLog(program);
        console.error('linke program error', err);
    }
    pathShader.program = program;
}

export default pathShader;
