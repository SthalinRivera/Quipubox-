import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Injectable()
export class R2Service {
  private s3Client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME');

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Faltan variables de entorno para Cloudflare R2');
    }

    this.bucket = bucketName;
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') ||
                     `https://${accountId}.r2.cloudflarestorage.com/${this.bucket}`;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadFile(file: MulterFile, folder: string = 'evidencias'): Promise<string> {
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(`${this.publicUrl}/`, '');
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
    );
  }
}