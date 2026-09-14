$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Viral Slayer HTTP Server running at http://localhost:$port/"

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "index.html"
            }

            $localPath = Join-Path $PSScriptRoot $urlPath.Replace('/', '\')

            if (Test-Path $localPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($localPath)

                $response.ContentType = $mime
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($err, 0, $err.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Request error: $_"
            if ($context.Response) {
                try { $context.Response.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
}
