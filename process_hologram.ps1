Add-Type -AssemblyName System.Drawing

function Make-Transparent([string]$src, [string]$dst) {
    if (-not (Test-Path $src)) {
        Write-Host "Source not found: $src"
        return
    }
    $fullSrc = (Resolve-Path $src).Path
    $bmp = [System.Drawing.Bitmap]::FromFile($fullSrc)
    $rect = [System.Drawing.Rectangle]::new(0, 0, $bmp.Width, $bmp.Height)
    $outBmp = [System.Drawing.Bitmap]::new($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    $srcData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dstData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    $bytes = [Math]::Abs($srcData.Stride) * $bmp.Height
    $rgbValues = [byte[]]::new($bytes)
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $rgbValues, 0, $bytes)
    
    for ($i = 0; $i -lt $bytes; $i += 4) {
        $b = $rgbValues[$i]
        $g = $rgbValues[$i + 1]
        $r = $rgbValues[$i + 2]
        $max = [Math]::Max($r, [Math]::Max($g, $b))
        if ($max -le 16) {
            $rgbValues[$i + 3] = 0
        } elseif ($max -lt 55) {
            $alpha = [byte](($max - 16) * 255 / 39)
            $rgbValues[$i + 3] = $alpha
        } else {
            $rgbValues[$i + 3] = 255
        }
    }
    
    [System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $dstData.Scan0, $bytes)
    $bmp.UnlockBits($srcData)
    $outBmp.UnlockBits($dstData)
    $bmp.Dispose()
    
    $outBmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Host "Successfully generated transparent PNG: $dst"
}

Make-Transparent "assets\holo_front.jpg" "assets\holo_front.png"
Make-Transparent "assets\holo_quarter.jpg" "assets\holo_quarter.png"
Make-Transparent "assets\holo_side.jpg" "assets\holo_side.png"
Make-Transparent "assets\holo_back.jpg" "assets\holo_back.png"
