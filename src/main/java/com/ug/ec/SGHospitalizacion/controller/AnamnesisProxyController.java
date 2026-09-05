package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/anamnesis")
public class AnamnesisProxyController {
    private static final String BACKEND_PATH = "/api/v1/anamnesis";

    private final BackendProxyService backendProxyService;

    public AnamnesisProxyController(BackendProxyService backendProxyService) {
        this.backendProxyService = backendProxyService;
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody String body) {
        return backendProxyService.post(BACKEND_PATH, body);
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

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable String id, @RequestBody String body) {
        return backendProxyService.put(BACKEND_PATH + "/" + id, body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        return backendProxyService.delete(BACKEND_PATH + "/" + id);
    }
}
