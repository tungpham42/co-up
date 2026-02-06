// Định nghĩa ánh xạ vị trí ban đầu ra quân cờ thật
export const INITIAL_REAL_PIECES: Record<string, string> = {
  a9: "r",
  b9: "n",
  c9: "b",
  d9: "a",
  e9: "k",
  f9: "a",
  g9: "b",
  h9: "n",
  i9: "r",
  b7: "c",
  h7: "c",
  a6: "p",
  c6: "p",
  e6: "p",
  g6: "p",
  i6: "p",
  a0: "R",
  b0: "N",
  c0: "B",
  d0: "A",
  e0: "K",
  f0: "A",
  g0: "B",
  h0: "N",
  i0: "R",
  b2: "C",
  h2: "C",
  a3: "P",
  c3: "P",
  e3: "P",
  g3: "P",
  i3: "P",
};

// FEN khởi đầu của cờ úp (tất cả là quân úp 'u', trừ 2 tướng 'k/K')
// Lưu ý: Tùy bộ thủ viện, quân úp có thể ký hiệu là 'u' hoặc 'x'
export const DARK_CHESS_START_FEN =
  "u u u u k u u u u/9/1u5u1/u1u1u1u1u/9/9/U1U1U1U1U/1U5U1/9/U U U U K U U U U r - - 0 1";

export const getRealPiece = (pos: string): string =>
  INITIAL_REAL_PIECES[pos] || "";
