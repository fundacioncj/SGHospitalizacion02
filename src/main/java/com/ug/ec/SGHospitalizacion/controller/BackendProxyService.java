package com.ug.ec.SGHospitalizacion.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class BackendProxyService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.backend.base-url}")
    private String backendBaseUrl;

    public ResponseEntity<String> get(String path) {
        return exchange(path, HttpMethod.GET, null);
    }

    public ResponseEntity<String> post(String path, String body) {
        return exchange(path, HttpMethod.POST, body);
    }

    public ResponseEntity<String> put(String path, String body) {
        return exchange(path, HttpMethod.PUT, body);
    }

    public ResponseEntity<String> delete(String path) {
        return exchange(path, HttpMethod.DELETE, null);
    }

    public ResponseEntity<byte[]> getBytes(String path) {

        HttpHeaders headers = createHeaders();

        headers.setAccept(
                java.util.List.of(MediaType.APPLICATION_PDF)
        );

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                backendBaseUrl + path,
                HttpMethod.GET,
                entity,
                byte[].class
        );
    }

    private ResponseEntity<String> exchange(
            String path,
            HttpMethod method,
            String body) {

        HttpHeaders headers = createHeaders();

        HttpEntity<String> entity =
                new HttpEntity<>(body, headers);

        return restTemplate.exchange(
                backendBaseUrl + path,
                method,
                entity,
                String.class
        );
    }

    private HttpHeaders createHeaders() {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        ServletRequestAttributes attributes =
                (ServletRequestAttributes)
                        RequestContextHolder.getRequestAttributes();

        if (attributes != null) {

            HttpServletRequest request =
                    attributes.getRequest();

            String cookie = request.getHeader("Cookie");

            if (cookie != null) {
                headers.set("Cookie", cookie);
            }
        }

        return headers;
    }
}