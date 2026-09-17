import Foundation
import Vision
import AppKit

let arguments = CommandLine.arguments.dropFirst()

guard !arguments.isEmpty else {
  fputs("Usage: swift scripts/ocr-ref.swift <image> [<image> ...]\n", stderr)
  exit(1)
}

func recognizeText(in url: URL) throws -> [String] {
  guard let image = NSImage(contentsOf: url),
        let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    throw NSError(domain: "OCR", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not load image"])
  }

  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.usesLanguageCorrection = true
  request.recognitionLanguages = ["la-Latn", "en-US"]
  request.minimumTextHeight = 0.01

  let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
  try handler.perform([request])

  let observations = request.results ?? []
  return observations.compactMap { observation in
    observation.topCandidates(1).first?.string
  }
}

for path in arguments {
  let url = URL(fileURLWithPath: path)
  print("===== \(url.lastPathComponent) =====")
  do {
    let lines = try recognizeText(in: url)
    print(lines.joined(separator: "\n"))
  } catch {
    print("OCR_ERROR: \(error.localizedDescription)")
  }
  print("")
}
