# Troubleshooting & Setup Guide

Guia detalhado para rodar o projeto em cada um dos três caminhos suportados, com os problemas mais comuns e como resolvê-los.

Resumo rápido dos comandos está no [README.md](./README.md). Este arquivo é para quando algo dá errado ou você quer instruções passo a passo.

---

## Índice

- [Rodar com Docker](#rodar-com-docker)
- [Rodar com Visual Studio 2022](#rodar-com-visual-studio-2022)
- [Rodar pelo terminal (CLI)](#rodar-pelo-terminal-cli)
- [Problemas comuns](#problemas-comuns)
- [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)

---

## Rodar com Docker

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) ou Docker Engine + Compose (Linux)

Valide com:

```bash
docker --version
docker compose version
```

### Passos

Na raiz do repositório:

```bash
docker compose up --build
```

Primeira execução puxa ~500 MB de imagens base (5–10 min). Execuções seguintes reusam o cache e sobem em segundos.

Quando os logs estabilizarem, acesse:

- Frontend: http://localhost:4200
- Backend:  http://localhost:5000/api/products

Parar: `Ctrl+C`, depois `docker compose down`.

### Dica para economizar tempo na entrevista

Rode `docker compose build` **antes** do início da sessão. Assim o pull e o build ficam feitos e `docker compose up` fica instantâneo.

---

## Rodar com Visual Studio 2022

O Visual Studio cuida bem do **backend .NET**, mas **não gerencia o Angular** — você ainda precisa de um terminal para o frontend. Então são dois processos: VS rodando a API, e um terminal rodando o `ng serve`.

### Pré-requisitos

1. **Visual Studio 2022** com o workload **ASP.NET and web development**
2. **.NET 8 SDK** — já vem no VS 2022 17.8+. Confirme com `dotnet --list-sdks` (precisa mostrar um `8.x.x`)
3. **Node.js 18+** → https://nodejs.org (LTS). **Reabra o VS** depois de instalar para ele enxergar o Node no PATH

### Passo 1 — Abrir o projeto backend

Abra `RubiconApi\RubiconApi.csproj`:

- Duplo-clique no arquivo, **ou**
- Dentro do VS: *File → Open → Project/Solution…*

> ❗ **Não** use *Open → Folder* na pasta `rubicon-interview`. Isso põe o VS em "Open Folder mode" (sem Solution Explorer completo). Abra pelo `.csproj`.

### Passo 2 — Restaurar pacotes NuGet

Se você vir `NETSDK1004: project.assets.json não encontrado`:

- Solution Explorer → botão direito em `RubiconApi` → **Restore NuGet Packages**, **ou**
- No terminal integrado (`Ctrl+\``):
  ```powershell
  dotnet restore
  ```

### Passo 3 — Rodar o backend

| Atalho | O que faz |
|---|---|
| **F5** | Roda com debug (breakpoints funcionam) |
| **Ctrl+F5** | Roda sem debug (mais rápido) |

Uma janela de console vai abrir:

```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

> A janela do console precisa ficar aberta. Fechou? A API cai.

Teste abrindo http://localhost:5000/api/products — deve responder `{"message":"Not implemented yet"}` (placeholder, indica que está no ar).

### Passo 4 — Rodar o frontend (fora do VS)

Abra um terminal separado (integrado do VS via *View → Terminal*, ou PowerShell externo):

```powershell
cd "C:\caminho\para\rubicon-interview\rubicon-front"
npm install
npm start
```

Quando aparecer:

```
Application bundle generation complete.
Local: http://localhost:4200/
```

Abra http://localhost:4200 no navegador.

### Parar tudo

- Backend: quadrado vermelho ⏹️ "Stop Debugging" na toolbar do VS, **ou** feche a janela do console
- Frontend: `Ctrl+C` no terminal → confirmar com `Y`

---

## Rodar pelo terminal (CLI)

Use quando quiser o ciclo de desenvolvimento mais rápido ou está fora do Windows.

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org)

Valide:

```bash
dotnet --version   # 8.x ou superior
node --version     # v18+ ou v20+
npm --version
```

Se o comando der "not recognized" no Windows, feche e reabra o terminal — o PATH não recarrega até reabrir.

### Terminal 1 — Backend

```bash
cd RubiconApi
dotnet restore
dotnet run
```

Aguarde:

```
Now listening on: http://localhost:5000
```

Deixe esse terminal aberto.

### Terminal 2 — Frontend

```bash
cd rubicon-front
npm install
npm start
```

Aguarde:

```
Local: http://localhost:4200/
```

Abra http://localhost:4200 no navegador.

### Parar

`Ctrl+C` em cada terminal.

---

## Problemas comuns

### `NETSDK1004: Arquivo de ativos 'project.assets.json' não encontrado`

Os pacotes NuGet não foram restaurados.

- **Visual Studio:** Solution Explorer → botão direito no projeto → **Restore NuGet Packages**
- **CLI:** `cd RubiconApi && dotnet restore`

### Porta 5000 já está em uso

Descubra quem está ocupando:

```powershell
netstat -ano | findstr :5000
```

Pegue o PID mostrado, abra o Task Manager e mate o processo. **Ou** mude a porta:

1. Edite `RubiconApi/Properties/launchSettings.json` → `"applicationUrl": "http://localhost:XXXX"`
2. Edite `rubicon-front/src/app/app.component.ts` → `API_URL = 'http://localhost:XXXX/api/products'`

### Porta 4200 já está em uso

O Angular CLI pergunta automaticamente se quer usar outra porta. Aceite e ajuste os links.

### `Could not find the '@angular-devkit/build-angular:application' builder's node package`

`node_modules` quebrado ou instalado antes do fix do `package.json`:

```bash
cd rubicon-front
rm -rf node_modules package-lock.json   # Windows: use rmdir /s /q
npm install
```

### Tabela fica vazia no navegador

**Comportamento esperado.** É o desafio. O backend responde com placeholder e os TODOs do frontend não estão implementados. Implemente os TODOs em `Program.cs` e `app.component.ts`.

### Erro de CORS no console do navegador

A API já configura `AllowAnyOrigin`. Se você mudou a URL do backend, confirme que o `API_URL` em `rubicon-front/src/app/app.component.ts` aponta para a porta certa.

### Prompt "Trust the HTTPS development certificate?"

Pode recusar — este projeto usa HTTP na porta 5000, não HTTPS. Pode ignorar o comando `dotnet dev-certs https --trust`.

### F5 no VS pede "select a launch profile"

Escolha **RubiconApi** (não IIS Express) no dropdown ao lado do botão de play.

### Breakpoints não param no Visual Studio

Confirme que está rodando com **F5** (debug), não **Ctrl+F5** (sem debug).

### `npm start` falha no terminal integrado do VS logo após instalar o Node

O VS só reconhece o Node recém-instalado depois de reiniciar. Feche e reabra o VS.

### Docker build lento na primeira vez

Normal — base images de .NET e Node somam ~500 MB. Builds seguintes usam cache de layer e levam segundos.

### Mudanças no Angular não aparecem no Docker

O `docker compose up` (Opção A) roda um build de produção estático servido pelo nginx — **não tem hot-reload**. Para desenvolvimento ativo, use Visual Studio ou CLI com `npm start`.

### Mudanças no C# não recarregam com `dotnet run`

Por padrão o `dotnet run` não observa arquivos. Use hot-reload:

```bash
dotnet watch run
```

No Visual Studio, habilite o ícone de chama 🔥 "Hot Reload" na toolbar.

---

## Fluxo de desenvolvimento

### Backend

| Cenário | Comportamento |
|---|---|
| `dotnet run` + mudança em `.cs` | Precisa parar (`Ctrl+C`) e rodar de novo |
| `dotnet watch run` + mudança em `.cs` | Recarrega automaticamente |
| VS F5 com Hot Reload ativo | Muitas mudanças entram sem reiniciar; mudanças estruturais pedem restart |
| VS F5 sem Hot Reload | Precisa parar (⏹️) e rodar de novo |

### Frontend

O `npm start` (`ng serve`) **sempre** tem hot-reload. Salvou, o navegador atualiza sozinho. Deixe rodando durante toda a sessão.

### Mudança de dependência

- **NuGet (`.csproj`):** a próxima build restaura automaticamente. Se der problema, rode `dotnet restore`.
- **npm (`package.json`):** precisa parar o `ng serve`, rodar `npm install`, e iniciar de novo.

---

## Como validar que está tudo funcionando

Quando o backend e frontend estão rodando (sem TODOs implementados ainda):

```bash
# Backend responde (placeholder)
curl http://localhost:5000/api/products
# → {"message":"Not implemented yet"}

# Frontend responde (HTML do Angular)
curl http://localhost:4200/
# → <!DOCTYPE html>...
```

Se ambos respondem, o setup está 100% — falta só implementar os TODOs do desafio.
