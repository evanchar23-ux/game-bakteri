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
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
    ".glb"  = "model/gltf-binary"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "index.html"
            }

            $localPath = Join-Path $PSScriptRoot $urlPath.Replace('/', '\')

            if (Test-Path $localPath -PathType Leaf) {
                $fileInfo = New-Object System.IO.FileInfo($localPath)
                $fileLen = $fileInfo.Length
                $ext = $fileInfo.Extension.ToLower()
                $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }

                $response.ContentType = $mime
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Accept-Ranges", "bytes")

                $rangeHeader = $request.Headers["Range"]
                if ($request.HttpMethod -eq "HEAD") {
                    $response.ContentLength64 = $fileLen
                    $response.StatusCode = 200
                }
                elseif ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                    $range = $rangeHeader.Substring(6).Split('-')
                    [long]$start = 0
                    [long]$end = $fileLen - 1

                    if (-not [string]::IsNullOrEmpty($range[0])) {
                        $start = [long]::Parse($range[0])
                    }
                    if ($range.Length -gt 1 -and -not [string]::IsNullOrEmpty($range[1])) {
                        $end = [long]::Parse($range[1])
                    }

                    if ($end -ge $fileLen) {
                        $end = $fileLen - 1
                    }

                    $lengthToRead = ($end - $start) + 1
                    $response.StatusCode = 206 # Partial Content
                    $response.ContentLength64 = $lengthToRead
                    $response.AddHeader("Content-Range", "bytes $start-$end/$fileLen")

                    $fs = [System.IO.File]::OpenRead($localPath)
                    try {
                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $buffer = New-Object byte[] 65536
                        [long]$bytesRemaining = $lengthToRead
                        while ($bytesRemaining -gt 0) {
                            $toRead = [int][Math]::Min(65536, $bytesRemaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $response.OutputStream.Write($buffer, 0, $read)
                            $bytesRemaining -= $read
                        }
                    } finally {
                        $fs.Close()
                    }
                } else {
                    $response.ContentLength64 = $fileLen
                    $response.StatusCode = 200
                    $bytes = [System.IO.File]::ReadAllBytes($localPath)
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $err.Length
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
