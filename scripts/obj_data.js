class OBJData {

    constructor() {
        this.vertices = [];
        this.tex_coords = [];
        this.normals = [];
        this.triangles = [];
    }

    addVertex(nums) {
        this.vertices.push(new OBJVertex(nums[0], nums[1], nums[2]));
    }
    addTexCoord(nums) {
        this.tex_coords.push(new OBJTexCoord(nums[0], nums[1]));
    }
    addNormal(nums) {
        this.normals.push(new OBJNormal(nums[0], nums[1], nums[2]));
    }
    addTriangle(p1, p2, p3) {
        this.triangles.push(new OBJTriangle(p1, p2, p3));
    }
    getPoint(nums) {
        if (nums.length == 2) {
            return new OBJPoint(this.vertices[nums[0] - 1], OBJTexCoord.EMPTY, this.normals[nums[1] - 1]);
        }
        return new OBJPoint(this.vertices[nums[0] - 1], this.tex_coords[nums[1] - 1], this.normals[nums[2] - 1]);
    }

    string() {
        let index = 0;
        let str = "";
        while (index < this.triangles.length) {
            str += this.triangles[index++].string() + '\n';
        }
        return str;
    }

}


class OBJVertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    string() {
        return `[ ${this.x}, ${this.y}, ${this.z} ]`;
    }
}
class OBJTexCoord {

    static EMPTY = new OBJTexCoord(0, 0);

    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
    string() {
        return `[ ${this.w}, ${this.h} ]`;
    }
}
class OBJNormal {
    constructor(x, y, z) {
        let mag = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        this.x = x * 1.0 / mag;
        this.y = y * 1.0 / mag;
        this.z = z * 1.0 / mag;
    }
    string() {
        return `[ ${this.x}, ${this.y}, ${this.z} ]`;
    }
}
class OBJPoint {
    constructor(vertex, tex_coord, normal) {
        this.vertex = vertex;
        this.tex_coord = tex_coord;
        this.normal = normal;
    }
    string() {
        return `( v: ${this.vertex.string()}, t: ${this.tex_coord.string()}, n: ${this.normal.string()} )`;
    }
}
class OBJTriangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        let a = [p2.vertex.x - p1.vertex.x, p2.vertex.y - p1.vertex.y, p2.vertex.z - p1.vertex.z];
        let b = [p3.vertex.x - p1.vertex.x, p3.vertex.y - p1.vertex.y, p3.vertex.z - p1.vertex.z];
        let x = a[1] * b[2] - a[2] * b[1];
        let y = a[2] * b[0] - a[0] * b[2];
        let z = a[0] * b[1] - a[1] * b[0];
        this.surfaceNormal = new OBJNormal(x, y, z);
    }
    string() {
        return `{\n\tp1: ${this.p1.string()}\n\tp2: ${this.p2.string()}\n\tp3: ${this.p3.string()}\n\tsurfaceNormal: ${this.surfaceNormal.string()}\n}`;
    }
}

export { OBJData };