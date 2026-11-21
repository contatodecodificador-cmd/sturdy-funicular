"""Pós das prévias/quadros 3D: bloom suave (brilho do Sol, faísca, luzes) + clarão opcional.
Uso: python3 pos.py <entrada.png> <saida.jpg> [--clarao 0..1]"""
import sys, numpy as np
from PIL import Image, ImageFilter
e, s = sys.argv[1], sys.argv[2]; cl = float(sys.argv[sys.argv.index('--clarao') + 1]) if '--clarao' in sys.argv else 0
im = Image.open(e).convert('RGB'); W, H = im.size; a = np.asarray(im).astype(np.float32) / 255
lum = a.mean(axis=2, keepdims=True); cla = np.clip((lum - 0.6) / 0.4, 0, 1) * a
bl = Image.fromarray((cla * 255).astype(np.uint8))
b1 = np.asarray(bl.filter(ImageFilter.GaussianBlur(W * 0.006))).astype(np.float32) / 255
b2 = np.asarray(bl.filter(ImageFilter.GaussianBlur(W * 0.025))).astype(np.float32) / 255
a = 1 - (1 - a) * (1 - np.clip(b1 * 0.7 + b2 * 0.6, 0, 1))
if cl: a = a * (1 - cl) + cl
Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(s, quality=90)
