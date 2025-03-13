import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private cookieService: CookieService) {
    this.updateHeaders();
  }

  // ✅ Método privado para actualizar los headers
  private updateHeaders(): void {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) // Solo agrega si hay token
    });
  }

  public setHeaders(headers: HttpHeaders) {
    this.headers = headers;
  }

  // ✅ Setter público para actualizar headers (usado en LoginComponent)
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
    this.updateHeaders();
  }

  // ✅ Devuelve los headers actuales sin modificar
  getHeaders(): HttpHeaders {
    return this.headers;
  }

  public static divideEvenly(numerator: number, minPartSize: number): number[] {
    if (numerator / minPartSize < 2) {
      return [numerator];
    }
    return [minPartSize, ...CommonService.divideEvenly(numerator - minPartSize, minPartSize)];
  }

  public static divideCurrencyEvenly(numerator: number, divisor: number): string[] {
    const minPartSize = +(numerator / divisor).toFixed(2);
    return CommonService.divideEvenly(numerator * 100, minPartSize * 100).map(v => (v / 100).toFixed(2));
  }

  // Devuelve la fecha en formato YYYY-MM-DD (string) considerando el UTC para zonas horarias
  public static fechaFormateada(inputDeFecha: string | Date): string {
    if (!inputDeFecha) return '';
    const fecha = new Date(inputDeFecha);
    return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  }

  public static fill(n: number, x: number): number[] {
    return Array(n).fill(x);
  }

  public static concat(xs: number[], ys: number[]): number[] {
    return xs.concat(ys);
  }

  public static quotrem(n: number, d: number): [number, number] {
    return [Math.floor(n / d), n % d];
  }

  public static distribute(p: number, d: number, n: number): number[] {
    const e = Math.pow(10, p);
    const [q, r] = CommonService.quotrem(n * e, d);
    return CommonService.concat(
      CommonService.fill(r, (q + 1) / e),
      CommonService.fill(d - r, q / e)
    );
  }

  base64toPDF(data: string, id: string): void {
    const bufferArray = this.base64ToArrayBuffer(data);
    const blobStore = new Blob([bufferArray], { type: 'application/pdf' });

    if (window.navigator && 'msSaveOrOpenBlob' in window.navigator) {
      (window.navigator as any).msSaveOrOpenBlob(blobStore);
      return;
    }

    const url = window.URL.createObjectURL(blobStore);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url;
    link.download = `${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  private base64ToArrayBuffer(data: string): Uint8Array {
    const binaryString = atob(data);
    return new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
  }
}
