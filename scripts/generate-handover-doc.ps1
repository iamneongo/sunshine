param(
  [string]$OutputPath = "D:\Coding\BDS\docs\huong-dan-ban-giao-sunshine-bay-retreat.docx"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = "D:\Coding\BDS"
$assetDir = Join-Path $repoRoot "docs\handover-assets"
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("bds-handover-docx-" + [guid]::NewGuid().ToString("N"))
$wordDir = Join-Path $tempRoot "word"
$wordRelDir = Join-Path $wordDir "_rels"
$mediaDir = Join-Path $wordDir "media"
$rootRelDir = Join-Path $tempRoot "_rels"
$docPropsDir = Join-Path $tempRoot "docProps"

$requiredAssets = @(
  "01-login.png",
  "02-overview.png",
  "03-leads.png",
  "04-lead-detail.png",
  "05-analytics.png",
  "06-follow-up.png",
  "07-maintenance.png",
  "08-landing-home.png"
)

foreach ($dir in @($tempRoot, $wordDir, $wordRelDir, $mediaDir, $rootRelDir, $docPropsDir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

foreach ($asset in $requiredAssets) {
  $path = Join-Path $assetDir $asset
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Không tìm thấy ảnh minh họa: $asset"
  }
}

function Escape-Xml([string]$Text) {
  if ([string]::IsNullOrEmpty($Text)) {
    return ""
  }

  return $Text.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;")
}

function New-TextParagraphXml {
  param(
    [string]$Text,
    [int]$FontSize = 22,
    [switch]$Bold,
    [switch]$Italic,
    [switch]$Center,
    [string]$Color = "1F2937",
    [int]$SpacingBefore = 0,
    [int]$SpacingAfter = 100
  )

  $escaped = Escape-Xml $Text
  $pPr = @()
  $rPr = @("<w:color w:val=`"$Color`"/>", "<w:sz w:val=`"$($FontSize * 2)`"/>", "<w:szCs w:val=`"$($FontSize * 2)`"/>")

  if ($Center) {
    $pPr += "<w:jc w:val=`"center`"/>"
  }

  $pPr += "<w:spacing w:before=`"$SpacingBefore`" w:after=`"$SpacingAfter`" w:line=`"360`" w:lineRule=`"auto`"/>"

  if ($Bold) {
    $rPr += "<w:b/>"
  }

  if ($Italic) {
    $rPr += "<w:i/>"
  }

  return @"
<w:p>
  <w:pPr>$($pPr -join "")</w:pPr>
  <w:r>
    <w:rPr>$($rPr -join "")</w:rPr>
    <w:t xml:space="preserve">$escaped</w:t>
  </w:r>
</w:p>
"@
}

function New-PageBreakXml {
  return @"
<w:p>
  <w:r>
    <w:br w:type="page"/>
  </w:r>
</w:p>
"@
}

$script:relationshipIndex = 2
$script:imageIndex = 1
$script:docPrIndex = 1
$script:imageMap = @{}
$documentRelationships = New-Object System.Collections.Generic.List[string]
$documentRelationships.Add('<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>')

function Add-ImageToPackage {
  param(
    [string]$AssetFileName
  )

  if ($script:imageMap.ContainsKey($AssetFileName)) {
    return $script:imageMap[$AssetFileName]
  }

  $sourcePath = Join-Path $assetDir $AssetFileName
  $extension = [System.IO.Path]::GetExtension($sourcePath).ToLowerInvariant()
  $targetName = "image$($script:imageIndex)$extension"
  $targetPath = Join-Path $mediaDir $targetName

  Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force

  $image = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $maxWidthPx = 620.0
    $scale = 1.0

    if ($image.Width -gt $maxWidthPx) {
      $scale = $maxWidthPx / $image.Width
    }

    $cx = [int64][math]::Round($image.Width * $scale * 9525)
    $cy = [int64][math]::Round($image.Height * $scale * 9525)
  } finally {
    $image.Dispose()
  }

  $relId = "rId$($script:relationshipIndex)"
  $documentRelationships.Add("<Relationship Id=`"$relId`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image`" Target=`"media/$targetName`"/>")

  $info = [pscustomobject]@{
    AssetFileName = $AssetFileName
    RelId = $relId
    FileName = $targetName
    Cx = $cx
    Cy = $cy
    DocPrId = $script:docPrIndex
  }

  $script:imageMap[$AssetFileName] = $info
  $script:relationshipIndex += 1
  $script:imageIndex += 1
  $script:docPrIndex += 1

  return $info
}

function New-ImageParagraphXml {
  param(
    [string]$AssetFileName
  )

  $imageInfo = Add-ImageToPackage -AssetFileName $AssetFileName
  $name = Escape-Xml $imageInfo.FileName

  return @"
<w:p>
  <w:pPr>
    <w:jc w:val="center"/>
    <w:spacing w:before="80" w:after="80"/>
  </w:pPr>
  <w:r>
    <w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0"
        xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
        <wp:extent cx="$($imageInfo.Cx)" cy="$($imageInfo.Cy)"/>
        <wp:docPr id="$($imageInfo.DocPrId)" name="$name"/>
        <wp:cNvGraphicFramePr>
          <a:graphicFrameLocks noChangeAspect="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>
        </wp:cNvGraphicFramePr>
        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:nvPicPr>
                <pic:cNvPr id="0" name="$name"/>
                <pic:cNvPicPr/>
              </pic:nvPicPr>
              <pic:blipFill>
                <a:blip r:embed="$($imageInfo.RelId)"/>
                <a:stretch>
                  <a:fillRect/>
                </a:stretch>
              </pic:blipFill>
              <pic:spPr>
                <a:xfrm>
                  <a:off x="0" y="0"/>
                  <a:ext cx="$($imageInfo.Cx)" cy="$($imageInfo.Cy)"/>
                </a:xfrm>
                <a:prstGeom prst="rect">
                  <a:avLst/>
                </a:prstGeom>
              </pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing>
  </w:r>
</w:p>
"@
}

$bodyXml = New-Object System.Collections.Generic.List[string]

function Add-Section {
  param(
    [string]$Title,
    [string[]]$Paragraphs,
    [string]$Image,
    [string]$Caption
  )

  $bodyXml.Add((New-TextParagraphXml -Text $Title -FontSize 18 -Bold -Color "0F172A" -SpacingBefore 220 -SpacingAfter 80))

  foreach ($paragraph in $Paragraphs) {
    $bodyXml.Add((New-TextParagraphXml -Text $paragraph -FontSize 11 -Color "334155" -SpacingAfter 50))
  }

  if ($Image) {
    $bodyXml.Add((New-ImageParagraphXml -AssetFileName $Image))
  }

  if ($Caption) {
    $bodyXml.Add((New-TextParagraphXml -Text $Caption -FontSize 10 -Italic -Center -Color "64748B" -SpacingAfter 120))
  }
}

$today = Get-Date -Format "dd/MM/yyyy"

$bodyXml.Add((New-TextParagraphXml -Text "TÀI LIỆU HƯỚNG DẪN SỬ DỤNG" -FontSize 28 -Bold -Center -Color "0F172A" -SpacingBefore 200 -SpacingAfter 80))
$bodyXml.Add((New-TextParagraphXml -Text "Website giới thiệu dự án và Dashboard quản trị lead" -FontSize 16 -Center -Color "475569" -SpacingAfter 40))
$bodyXml.Add((New-TextParagraphXml -Text "Sunshine Bay Retreat Vũng Tàu" -FontSize 18 -Bold -Center -Color "B8860B" -SpacingAfter 30))
$bodyXml.Add((New-TextParagraphXml -Text "Ngày cập nhật tài liệu: $today" -FontSize 11 -Center -Color "64748B" -SpacingAfter 220))
$bodyXml.Add((New-TextParagraphXml -Text "Tài liệu này được soạn để phục vụ bàn giao vận hành, giúp người tiếp nhận có thể truy cập, sử dụng, theo dõi lead và bảo trì hệ thống một cách nhanh, dễ hiểu và dễ thao tác." -FontSize 11 -Center -Color "334155" -SpacingAfter 200))
$bodyXml.Add((New-PageBreakXml))

Add-Section -Title "1. Mục đích tài liệu" -Paragraphs @(
  "- Tài liệu này dùng để bàn giao website landing page và dashboard quản trị lead của dự án Sunshine Bay Retreat.",
  "- Người nhận bàn giao chỉ cần làm theo các bước trong tài liệu là có thể đăng nhập, theo dõi lead, xem analytics, gọi lại bằng call bot và xử lý một số thao tác bảo trì cơ bản."
) -Image "" -Caption ""

Add-Section -Title "2. Tổng quan hệ thống" -Paragraphs @(
  "- Landing page: website giới thiệu dự án, nhận lead từ form và chatbot.",
  "- Dashboard: khu quản trị dành cho admin để xem dữ liệu, lọc lead, mở chi tiết lead, theo dõi activity và thao tác bảo trì.",
  "- Nguồn lead hiện tại: Form và Chatbot.",
  "- Nguồn dữ liệu hiện tại: Supabase."
) -Image "" -Caption ""

Add-Section -Title "3. Thông tin truy cập" -Paragraphs @(
  "- Website chính: https://vungtaudongtien.com",
  "- Trang đăng nhập dashboard: https://vungtaudongtien.com/login",
  "- Tài khoản admin hiện tại: admin",
  "- Mật khẩu hiện tại: Sunshine@2026",
  "- Khuyến nghị: đổi thông tin đăng nhập nội bộ ngay sau khi bàn giao chính thức."
) -Image "" -Caption ""

Add-Section -Title "4. Đăng nhập dashboard" -Paragraphs @(
  "Bước 1: Mở link /login trên domain chính.",
  "Bước 2: Nhập tài khoản admin và mật khẩu hiện tại.",
  "Bước 3: Bấm 'Vào dashboard' để truy cập khu quản trị.",
  "Nếu đăng nhập thất bại, cần kiểm tra lại tài khoản đang cấu hình trong hệ thống."
) -Image "01-login.png" -Caption "Hình 1. Trang đăng nhập dashboard"

Add-Section -Title "5. Màn hình Tổng quan" -Paragraphs @(
  "Trang Tổng quan dùng để theo dõi nhanh tình hình vận hành trong ngày.",
  "- Xem tổng số lead, lead nóng, lead chưa gọi và lead đã đặt lịch.",
  "- Khu 'Lead nên xử lý trước' giúp ưu tiên những lead cần liên hệ sớm.",
  "- Khu 'Event mới nhất' giúp kiểm tra hệ thống chatbot, form và dashboard có đang ghi nhận activity bình thường hay không."
) -Image "02-overview.png" -Caption "Hình 2. Trang Tổng quan"

Add-Section -Title "6. Danh sách lead" -Paragraphs @(
  "Trang Leads là nơi team sale làm việc hằng ngày nhiều nhất.",
  "- Có thể tìm kiếm theo tên, số điện thoại, email, nhu cầu hoặc ghi chú.",
  "- Có thể lọc theo nguồn, độ nóng, trạng thái, nhu cầu và ngân sách.",
  "- Bấm 'Detail' để mở hồ sơ chi tiết của lead.",
  "- Các nút Gọi và Zalo giúp liên hệ nhanh ngay trên bảng lead."
) -Image "03-leads.png" -Caption "Hình 3. Trang danh sách lead"

Add-Section -Title "7. Chi tiết lead và gọi lại bằng call bot" -Paragraphs @(
  "Khi mở một lead, admin sẽ thấy hồ sơ liên hệ, ghi chú tích lũy, lịch sử tương tác và metadata kỹ thuật liên quan.",
  "- Có thể cập nhật trạng thái, độ nóng, kênh ưu tiên, lịch hẹn và ghi chú nội bộ.",
  "- Nút 'Call bot' dùng khi admin muốn kích hoạt cuộc gọi lại thủ công.",
  "- Hệ thống hiện tại đã tự tạo/cập nhật lead ngay khi khách để lại số điện thoại từ form hoặc chatbot; khi khách bổ sung thêm tên, tài chính hoặc lịch hẹn thì lead sẽ được cập nhật tiếp."
) -Image "04-lead-detail.png" -Caption "Hình 4. Trang chi tiết lead"

Add-Section -Title "8. Analytics" -Paragraphs @(
  "Trang Analytics dùng để theo dõi activity thực tế của hệ thống.",
  "- Biểu đồ 7 ngày gần đây hiển thị activity theo ngày.",
  "- Khu 'Sự kiện nổi bật' cho biết loại event nào đang xuất hiện nhiều.",
  "- Các nhóm thống kê phụ giúp nhìn nhanh theo nguồn, nhu cầu, ngân sách, độ nóng và trạng thái lead."
) -Image "05-analytics.png" -Caption "Hình 5. Trang Analytics"

Add-Section -Title "9. Follow-up" -Paragraphs @(
  "Trang Follow-up được thiết kế cho team sale xử lý công việc trong ngày.",
  "- Hiển thị nhóm lead ưu tiên cần xử lý trước.",
  "- Có các cụm công việc để đi nhanh đến nhóm lead đang đặt lịch, đã gửi thông tin hoặc cần gọi gấp.",
  "- Phù hợp để mở vào đầu ngày và cuối mỗi ca làm việc."
) -Image "06-follow-up.png" -Caption "Hình 6. Trang Follow-up"

Add-Section -Title "10. Maintenance và xóa dữ liệu" -Paragraphs @(
  "Trang Maintenance dùng cho thao tác bảo trì hệ thống.",
  "- Có 2 nhóm thao tác chính: xóa data test và xóa data người dùng.",
  "- Trước khi xóa, hệ thống có bước xác nhận kỹ để tránh thao tác nhầm.",
  "- Chỉ sử dụng trang này khi cần dọn môi trường hoặc xử lý dữ liệu phát sinh sai."
) -Image "07-maintenance.png" -Caption "Hình 7. Trang Maintenance"

Add-Section -Title "11. Landing page và cách khách để lại thông tin" -Paragraphs @(
  "Landing page là nơi tiếp nhận lead từ khách hàng.",
  "- Khách có thể xem nội dung dự án, để lại form hoặc chat với chatbot ngay trên trang.",
  "- Nếu khách để lại số điện thoại, hệ thống sẽ tạo/cập nhật lead trong dashboard.",
  "- Khi đủ điều kiện và cấu hình call bot đang bật, hệ thống có thể trigger cuộc gọi tự động.",
  "- Nếu cần gọi lại thủ công, admin thực hiện trong trang chi tiết lead."
) -Image "08-landing-home.png" -Caption "Hình 8. Landing page giới thiệu dự án"

Add-Section -Title "12. Quy trình vận hành khuyến nghị" -Paragraphs @(
  "1. Đầu ngày: vào Tổng quan để xem lead nóng và activity mới.",
  "2. Mở Follow-up hoặc Leads để xử lý những lead ưu tiên trước.",
  "3. Mở chi tiết lead để đọc bối cảnh, cập nhật trạng thái và ghi chú.",
  "4. Dùng Call bot khi cần gọi lại thủ công cho từng lead.",
  "5. Cuối ngày: mở Analytics để kiểm tra hệ thống có đang ghi nhận event bình thường hay không."
) -Image "" -Caption ""

Add-Section -Title "13. Lưu ý cấu hình" -Paragraphs @(
  "- Nếu đổi domain, cần kiểm tra APP_BASE_URL và NEXT_PUBLIC_SITE_URL.",
  "- Nếu call bot không chạy, cần kiểm tra các biến UCALL_BASE_URL, UCALL_API_KEY, UCALL_COMPANY_SLUG, UCALL_CALL_CAMPAIGN_ID, UCALL_RUN_CAMPAIGN_ON_TRIGGER.",
  "- Dữ liệu lead và event hiện đang đọc từ Supabase.",
  "- Người tiếp nhận bàn giao nên lưu trữ tài liệu này cùng thông tin đăng nhập ở khu vực nội bộ an toàn."
) -Image "" -Caption ""

Add-Section -Title "14. Checklist bàn giao" -Paragraphs @(
  "- Đăng nhập dashboard thành công.",
  "- Landing page mở bình thường trên domain chính.",
  "- Form và chatbot ghi nhận lead vào dashboard.",
  "- Dashboard xem được lead, analytics, follow-up và maintenance.",
  "- Call bot thủ công hoạt động khi bấm trong trang chi tiết lead.",
  "- Chức năng xóa dữ liệu có xác nhận trước khi xóa."
) -Image "" -Caption ""

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
$($bodyXml -join "`r`n")
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$stylesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>
"@

$documentRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
$($documentRelationships -join "`r`n")
</Relationships>
"@

$rootRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"@

$contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"@

$created = (Get-Date).ToUniversalTime().ToString("s") + "Z"
$coreXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Tài liệu hướng dẫn sử dụng Sunshine Bay Retreat</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">$created</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">$created</dcterms:modified>
</cp:coreProperties>
"@

$appXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
</Properties>
"@

Set-Content -LiteralPath (Join-Path $tempRoot "[Content_Types].xml") -Value $contentTypesXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $rootRelDir ".rels") -Value $rootRelsXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $wordDir "document.xml") -Value $documentXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $wordRelDir "document.xml.rels") -Value $documentRelsXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $wordDir "styles.xml") -Value $stylesXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $docPropsDir "core.xml") -Value $coreXml -Encoding utf8
Set-Content -LiteralPath (Join-Path $docPropsDir "app.xml") -Value $appXml -Encoding utf8

$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDir)) {
  New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

if (Test-Path -LiteralPath $OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempRoot, $OutputPath)

$zip = [System.IO.Compression.ZipFile]::OpenRead($OutputPath)
try {
  if (-not ($zip.Entries.FullName -contains "word/document.xml")) {
    throw "File docx tạo ra không hợp lệ."
  }
} finally {
  $zip.Dispose()
}

Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Đã tạo tài liệu:" $OutputPath
