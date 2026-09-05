package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteProxyController {

    private static final String BACKEND_PATH = "/api/v1/pacientes";

    private final BackendProxyService backendProxyService;

    public PacienteProxyController(BackendProxyService backendProxyService) {
        this.backendProxyService = backendProxyService;
    }


    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<String> buscarPorCedula(@PathVariable String cedula) {
        return backendProxyService.get(
                BACKEND_PATH + "/cedula/" + cedula
        );
    }
}