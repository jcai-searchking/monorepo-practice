import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Lobby,
  LobbyDetailResponse,
  LobbyListResponse,
  CreateLobbyRequest,
  UpdateLobbyRequest,
} from '../models/lobby';

@Injectable({ providedIn: 'root' })
export class LobbyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/lobbies`;

  /** POST /lobbies - HOST/ADMIN only (enforced by backend) */
  createLobby(data: CreateLobbyRequest) : Observable<Lobby> {
    return this.http
      .post<{ message: string; lobby: Lobby }>(this.baseUrl, data)
      .pipe(map((res) => res.lobby))
  }

  /** GET /lobbies — active lobbies (endTime in the future), soonest first. */
  listLobbies(): Observable<Lobby[]> {
    return this.http
      .get<LobbyListResponse>(this.baseUrl)
      .pipe(map((res) => res.lobbies));
  }

  /** GET /lobbies/:id — full detail for a single lobby. */
  getLobby(id: string): Observable<Lobby> {
    return this.http
      .get<LobbyDetailResponse>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.lobby));
  }
  
  updateLobby(id: string, data: UpdateLobbyRequest): Observable<Lobby> {
  return this.http
    .patch<{ message: string; lobby: Lobby }>(`${this.baseUrl}/${id}`, data)
    .pipe(map((res) => res.lobby));
  }

  /** DELETE /lobbies/:id - owner or admin only (enforced by backend) */
  deleteLobby(id:string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
