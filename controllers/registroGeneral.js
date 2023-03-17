const { response, request } = require("express");
const mongoose = require("mongoose");
const blobService = require("../database/blobStorageConnection");
const RegistroGeneral = require("../models/registroGeneral");

// metodo post para crear un registro general y guardar las fotos en blob storage, las fotos vienen en un array en base64
const crearRegistroGeneral = async (req = request, res = response) => {
  try {
    const { titulo, descripcion, fotos } = req.body;
    const { usuario } = req;
    let arrayIdImg = [];

    // PASAR LAS FOTOS DE BASE64 A FILE Y GUARDARLAS EN BLOB STORAGE
    fotos.map((fotos) => {
      const newId = mongoose.Types.ObjectId();
      // pasar de base64 a file
      const buffer = Buffer.from(fotos, "base64");
      // guardar en blob storage
      const containerClient =
        blobService.getContainerClient("modulo-control-qa");
      const blobClient = containerClient.getBlockBlobClient(`${newId}.png`);
      const options = { blobHTTPHeaders: { blobName: `${newId}` } };
      blobClient.upload(buffer, buffer.length, options);
      // guardar el id de la foto en un array
      arrayIdImg.push(newId);
    });

    const registroGeneral = new RegistroGeneral({
      titulo,
      descripcion,
      fotos: arrayIdImg,
      idUsuario: usuario._id,
    });

    await registroGeneral.save();
    res.status(201).json({
      ok: true,
      registroGeneral,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado, hable con el administrador",
    });
  }
};

// obtener todos los registros generales de un usuario
const obtenerRegistrosGenerales = async (req = request, res = response) => {
  try {
    let { limite = 5, desde = 0, search = "" } = req.query;
    const { usuario } = req;
    console.log(usuario);

    const query = { idUsuario: usuario._id };

    const [total, registrosGenerales] = await Promise.all([
      RegistroGeneral.countDocuments(query),
      RegistroGeneral.find(query).sort({ _id: -1 })
       .skip(Number(desde))
       .limit(Number(limite))
    ]);

    res.status(200).json({
      ok: true,
      total,
      registrosGenerales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado, hable con el administrador",
    });
  }
};

const obtenerRegistroById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const registroGeneral = await RegistroGeneral.findById(id);

    const blobNames = registroGeneral.fotos;
    const containerClient = blobService.getContainerClient("modulo-control-qa");
    const promises = blobNames.map(async (blobName) => {
      const blobClient = containerClient.getBlobClient(`${blobName}.png`);
      const blobExists = await blobClient.exists();
      if (blobExists) {
        const downloadBlockBlobResponse = await blobClient.download();
        const contentType = downloadBlockBlobResponse.contentType;
        const buffer = await streamToBuffer(
          downloadBlockBlobResponse.readableStreamBody
        );
        const base64 = buffer.toString("base64");
        return { name: blobName, base64 };
      } else {
        return { name: blobName, base64: null };
      }
    });
    const results = await Promise.all(promises);
    res.status(200).json({
      ok: true,
      registroGeneral,
      fotos: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado, hable con el administrador",
    });
  }

  // Función que convierte un flujo de lectura en un búfer
  async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
};

module.exports = {
  crearRegistroGeneral,
  obtenerRegistrosGenerales,
  obtenerRegistroById,
};
