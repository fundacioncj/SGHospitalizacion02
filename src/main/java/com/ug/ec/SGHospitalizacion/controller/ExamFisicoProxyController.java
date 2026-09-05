package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/examenes-medicos")
public class ExamFisicoProxyController {

    private static final String BACKEND_PATH = "/api/v1/examenes-medicos";
    private final BackendProxyService backendProxyService;

    public ExamFisicoProxyController(BackendProxyService backendProxyService) {
        this.backendProxyService = backendProxyService;
    }

    @GetMapping
    public ResponseEntity<String> listar() {
        return backendProxyService.get(BACKEND_PATH);
    }

    @GetMapping("/paciente/cedula/{cedula}")
    public ResponseEntity<String> buscarPorCedula(@PathVariable String cedula) {
        return backendProxyService.get(BACKEND_PATH + "/paciente/cedula/" + cedula);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> obtenerPorId(@PathVariable String id) {
        return backendProxyService.get(BACKEND_PATH + "/" + id);
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody String body) {
        return backendProxyService.post(BACKEND_PATH, body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable String id, @RequestBody String body) {
        return backendProxyService.put(BACKEND_PATH + "/" + id, body);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generarPdf(@PathVariable String id) {
        return backendProxyService.getBytes(
                BACKEND_PATH + "/" + id + "/pdf"
        );
    }
}