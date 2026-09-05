package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {

    // @GetMapping("/")
    // public String inicio(Model model) {
    //     model.addAttribute("activePage", "home-page");
    //     model.addAttribute("tipo", "home-page");
    //     model.addAttribute("activePage", "hospitalizacion");
    //     return "index";
    // }

    @GetMapping("/home")
    public String home(Model model) {

        model.addAttribute("activePage", "home-page");
        model.addAttribute("tipo", "home-page");
        model.addAttribute("activePage", "home");

        return "Home/home";
    }

    // @GetMapping("/home")
    // public String home(Model model) {
    //     model.addAttribute("activePage", "home");
    //     model.addAttribute("title", "SGHospitalización");
    //     return "layout/layout";
    // }

    @GetMapping("/hospitalizacion")
    public String hospitalizacion(Model model) {
        model.addAttribute("activePage", "hospitalizacion");
        return "Hospitalizacion/hospitalizacion";
    }

    @GetMapping("/hospitalizacion/crearHospitalizacion")
    public String crearHospitalizacion(Model model) {
        model.addAttribute("activePage", "PRUEBA");
        return "Hospitalizacion/crear-hospitalizacion";
    }

    @GetMapping("/hospitalizacion/verHospitalizacion")
    public String verHospitalizacion(Model model) {
        model.addAttribute("activePage", "hospitalizacion");
        return "Hospitalizacion/ver-hospitalizacion";
    }

    @GetMapping("/hospitalizacion/editarHospitalizacion")
    public String editarHospitalizacion(Model model) {
        model.addAttribute("activePage", "hospitalizacion");
        return "Hospitalizacion/editar-hospitalizacion";
    }

    @GetMapping("/historia-clinica")
    public String hc(Model model) {
        model.addAttribute("activePage", "historia-clinica");
        return "HistoriaClinica/historia-clinica";
    }

    @GetMapping("/historia-clinica/crearHistoriaClinica")
    public String crearHistoriaClinica(Model model) {
        model.addAttribute("activePage", "crearHistoriaClinica");
        return "HistoriaClinica/crear-historia-clinica";
    }

    @GetMapping("/historia-clinica/verHistoriaClinica")
    public String verHistoriaClinica(Model model) {
        model.addAttribute("activePage", "historiaClinica");
        return "HistoriaClinica/ver-historia-clinica";
    }

    @GetMapping("/historia-clinica/editarHistoriaClinica")
    public String editarHistoriaClinica(Model model) {
        model.addAttribute("activePage", "historiaClinica");
        return "HistoriaClinica/editar-historia-clinica";
    }

    @GetMapping("/anamnesis")
    public String anamnesis(Model model) {
        model.addAttribute("activePage", "anamnesis");
        return "anamnesis";
    }

    @GetMapping("/anamnesis/crearAnamnesis")
    public String crearAnamnesis(Model model) {
        model.addAttribute("activePage", "crearAnamnesis");
        return "crear-anamnesis";
    }

    @GetMapping("/anamnesis-examen-fisico")
    public String crearAnamnesisExamenFisico() {
        return "AnamnesisExamenFisico/anamnesis-examen-fisico";
    }

    @GetMapping("/examen-fisico")
    public String examenFisico() {
        return "AnamnesisExamenFisico/examen-fisico";
    }

    @GetMapping("/anamnesis-examen-fisico/pdf")
    public String visualizarPdf() {
        return "PDF";
    }
}