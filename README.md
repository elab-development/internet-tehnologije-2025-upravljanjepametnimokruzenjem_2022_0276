#  Sistem za upravljanje pametnim okruženjem

Ovo je web aplikacija za upravljanje pametnim uređajima u okviru pametnog okruženja. Sistem omogućava kontrolu objektima (stanovi), uređajima unutar njih i korisnicima. Sistem podržava različite uloge i u okviru njih različite kontrole (admin, dete, korisnik, vlasnik stana)

##  Tehnologije
Aplikacija je izgrađena korišćenjem modernog tehnološkog stack-a:
- **Frontend:** React.js (Vite)
- **Backend:** Laravel (PHP)
- **Baza podataka:** MySQL
- **Dokumentacija:** Swagger (OpenAPI)
- **Infrastruktura:** Docker & Docker Compose

## Instalacija i pokretanje (Docker)
Najbrži način da pokrenete projekat je korišćenjem Docker-a.

1. **Kloniranje repozitorijuma:**
   
    git clone <url>
    cd <ime-foldera>
2. **Pokretanje aplikacije**
    docker compose up -d --build
3. **Pristup aplikaciji**
    Frontend:http://localhost:3000
    Backend: http://localhost:8000
    Swagger Dokumentacija: http://localhost:8000/api/documentation
4. **Struktura projekta**
    /frontend: React aplikacija sa Vite build alatom.
    /backend: Laravel API sa Swagger integracijom.
    docker-compose.yaml: Konfiguracija za orkestraciju svih servisa.
5. **Komande**
    
    docker exec -it pametna_kuca_api php artisan migrate:fresh --seed
    
    Generisanje Swagger API dokumentacije:
    docker exec -it pametna_kuca_api php artisan l5-swagger:generate
