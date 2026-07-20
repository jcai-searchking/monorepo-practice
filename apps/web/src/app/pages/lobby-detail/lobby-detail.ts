import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { LobbyService } from '../../services/lobby.service';
import { GENDER_LABELS, Lobby, SKILL_LABELS } from '../../models/lobby';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lobby-detail',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './lobby-detail.html',
  styleUrl: './lobby-detail.css',
})
export class LobbyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly lobbyService = inject(LobbyService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router)

  readonly lobby = signal<Lobby | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.lobbyService.getLobby(id).subscribe({
      next: (lobby) => {
        this.lobby.set(lobby);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Something went wrong loading this lobby.');
        }
      },
    });
  }

  get skillLabel(): string {
    const l = this.lobby();
    return l ? SKILL_LABELS[l.skillLevel] : '';
  }

  get genderLabel(): string {
    const l = this.lobby();
    return l ? GENDER_LABELS[l.genderFormat] : '';
  }

  canDelete(): boolean {
    const user = this.auth.currentUser();
    const lobby = this.lobby();
    if (!user || !lobby ) return false;
    return user.id === lobby.host.id || user.role === "ADMIN";
  }

  deleteLobby():void {
    const lobby = this.lobby();
    if (!lobby || !confirm('Delete this lobby? This cannot be undone.')) return;
    this.deleting.set(true);
    this.lobbyService.deleteLobby(lobby.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.deleting.set(false); this.deleteError.set('Could not delete this lobby')}
    })
  }


}
