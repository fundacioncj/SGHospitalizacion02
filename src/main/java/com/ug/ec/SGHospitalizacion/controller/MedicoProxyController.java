package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medicos")
public class MedicoProxyController {

    private static final String BACKEND_PATH = "/api/v1/hospitalizaciones/medicos";

    private final BackendProxyService backendProxyService;

    public MedicoProxyController(BackendProxyService backendProxyService) {
        this.backendProxyService = backendProxyService;
    }

    @GetMapping
    public ResponseEntity<String> listarMedicos() {
        return backendProxyService.get(BACKEND_PATH);
    }
}