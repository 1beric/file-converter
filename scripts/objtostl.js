import { load_canvas } from "./three-viewer.js";
import { OBJData } from "./obj_data.js";

var input = document.getElementById("input-file");
var input_label = document.getElementById("input-file-label");
var spinner = document.getElementById("spinner");
var convert_button = document.getElementById("convert-button");
var output = document.getElementById("download");
var viewer = document.getElementById("viewer");

class OBJtoSTL {

    static FROM = ".obj";
    static TO = ".stl";

    constructor(file) {
        if (!file.endsWith(OBJtoSTL.FROM)) {
            console.error(`unsupported filetype: ${file}`);
        }
        this.file = file;
    }

    // returns true on success
    convert(file_data) {
        let lines = file_data.split('\n');

        if (lines.length > 1000000) {
            // five hundred thousand lines is a ton
            alert("File too big");
            return "";
        }

        // console.log(lines);
        let objdata = new OBJData();
        let mapFloat = (e) => parseFloat(e);

        let index = 0;
        while (index < lines.length) {
            let line = lines[index];
            // console.log(line);

            if (line.startsWith("v ")) {
                // vertex
                let nums = line.split(/\s+/).slice(1, 4).map(mapFloat);
                // console.log(`v: ${nums}`);
                objdata.addVertex(nums);
            } else if (line.startsWith("vt ")) {
                // texCoord
                let nums = line.split(/\s+/).slice(1, 3).map(mapFloat);
                // console.log(`t: ${nums}`);
                objdata.addTexCoord(nums);
            } else if (line.startsWith("vn ")) {
                // normal
                let nums = line.split(/\s+/).slice(1, 4).map(mapFloat);
                // console.log(`n: ${nums}`);
                objdata.addNormal(nums);
            } else if (line.startsWith("f ")) {
                // face
                let points = line.split(/\s+/).slice(1).filter((e) => e.length > 0).map((e) => {
                    return objdata.getPoint(e.split("/").filter((e) => e.length > 0).map(mapFloat));
                });
                // console.log(points);


                let p_index = 1;
                while (p_index < points.length - 1) {
                    objdata.addTriangle(points[0], points[p_index], points[p_index + 1]);
                    p_index++;
                }

            }

            index++;
        }
        // console.log(objdata.string());
        // return objdata.string();

        let out_data = `solid ${this.file.slice(0, -4)}\n`;

        let i = 0;
        while (i < objdata.triangles.length) {
            let tri = objdata.triangles[i];
            out_data += `facet normal ${tri.surfaceNormal.x} ${tri.surfaceNormal.y} ${tri.surfaceNormal.z}\n`;
            // out_data += `facet normal 0 0 0\n`;
            out_data += `outer loop\n`;
            out_data += `vertex ${tri.p1.vertex.x} ${tri.p1.vertex.y} ${tri.p1.vertex.z}\n`;
            out_data += `vertex ${tri.p2.vertex.x} ${tri.p2.vertex.y} ${tri.p2.vertex.z}\n`;
            out_data += `vertex ${tri.p3.vertex.x} ${tri.p3.vertex.y} ${tri.p3.vertex.z}\n`;
            out_data += `end loop\n`;
            out_data += `endfacet\n`;
            i++;
        }
        return out_data;
    }

}



function convert_pressed() {
    setSpinner(true);
    let file = undefined;
    if (input.files.length >= 1) {
        file = input.files[0];
    }
    if (file != undefined) {
        let fReader = new FileReader();
        fReader.onload = function (e) {
            let file_data = e.target.result;
            // console.log(file_data);
            let converter = new OBJtoSTL(file.name);
            let out_data = converter.convert(file_data);
            if (out_data == "") {
                spinner.style.display = "none";
                return;
            }

            output.download = file.name.slice(0, -4) + ".stl";
            let out_file = new Blob([out_data], { type: 'model/stl' });
            // console.log(out_data);
            // console.log(out_file);
            output.href = window.URL.createObjectURL(out_file);
            setTimeout(setSpinner, 1000, false);
            viewer.style.display = "block";
            load_canvas(out_file, viewer);
            console.log("file converted");
        }
        fReader.readAsText(file);
    }
}

function setSpinner(on) {
    if (on) {
        spinner.style.display = "block";
        // output.style.display = "none";
    } else {
        spinner.style.display = "none";
        output.style.display = "block";
    }
}

function rename_input() {
    if (input.files.length >= 1) {
        input_label.textContent = input.files[0].name;
        console.log("changed to " + input.files[0].name);
    }
}

convert_button.addEventListener("click", convert_pressed);
input.addEventListener("change", rename_input);







