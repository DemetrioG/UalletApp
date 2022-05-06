// Atraso de tela

export default function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
